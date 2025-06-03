import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOrderConfirmationEmail = (order, user) => {
  const itemsList = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
        item.name
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
      <p>Dear ${user.username},</p>
      <p>Thank you for your order! Here are your order details:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${order.paypalOrderId}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleString()}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr style="background-color: #f5f5f5;">
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total Amount:</strong></td>
            <td style="padding: 10px;"><strong>$${order.totalAmount.toFixed(
              2
            )}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Shipping Information:</h3>
        <p>Country: ${order.shippingInfo.country || "N/A"}</p>
        <p>City: ${order.shippingInfo.city || "N/A"}</p>
        <p>Address: ${order.shippingInfo.apartment || "N/A"}</p>
        <p>Phone: ${order.shippingInfo.phoneNumber || "N/A"}</p>
      </div>

      <p>If you have any questions about your order, please don't hesitate to contact us.</p>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;
};

const sendOrderStatusEmail = async (user, order, status) => {
  try {
    await resend.emails.send({
      from: "Your Store <noreply@yourdomain.com>",
      to: user.email,
      subject: `Order ${order.paypalOrderId} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Order Status Update</h1>
          <p>Dear ${user.username},</p>
          <p>Your order status has been updated to: <strong>${status}</strong></p>
          <p>Order ID: ${order.paypalOrderId}</p>
          <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending order status email:", error);
  }
};

export const createOrder = async (paymentData, userId) => {
  try {
    if (!paymentData || !userId) {
      throw new Error("Missing required payment data or user ID");
    }

    if (!paymentData.id) {
      throw new Error("PayPal order ID is required");
    }

    const [cart, user] = await Promise.all([
      Cart.findOne({ user: userId }),
      User.findById(userId),
    ]);

    if (!cart?.items?.length) {
      throw new Error("Cart is empty");
    }

    if (!user) {
      throw new Error("User not found");
    }

    const existingOrder = await Order.findOne({
      "orders.paypalOrderId": paymentData.id,
    });

    if (existingOrder) {
      const existingOrderDetails = existingOrder.orders.find(
        (order) => order.paypalOrderId === paymentData.id
      );
      return existingOrderDetails;
    }

    const newOrder = {
      paypalOrderId: paymentData.id,
      items: cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: cart.totalPrice,
      status: paymentData.status || "COMPLETED",
      payer: {
        email_address: paymentData.payer?.email_address || "",
        payer_id: paymentData.payer?.payer_id || "",
        name: {
          given_name: paymentData.payer?.name?.given_name || "",
          surname: paymentData.payer?.name?.surname || "",
        },
        address: {
          country_code: paymentData.payer?.address?.country_code || "",
        },
      },
      shippingInfo: user.deliveryInfo || {},
      createdAt: new Date(),
    };

    let userOrders = await Order.findOne({ user: userId });

    if (!userOrders) {
      userOrders = new Order({
        user: userId,
        orders: [newOrder],
      });
    } else {
      userOrders.orders.push(newOrder);
    }

    await userOrders.save();

    await Cart.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
        },
      },
      { new: true }
    );

    try {
      await resend.emails.send({
        from: "Your Store <noreply@yourdomain.com>",
        to: user.email,
        subject: `Order Confirmation #${newOrder.paypalOrderId}`,
        html: generateOrderConfirmationEmail(newOrder, user),
      });
      console.log("Order confirmation email sent successfully");
    } catch (emailError) {
      console.error("Error sending order confirmation email:", emailError);
    }

    return newOrder;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

export const getUserOrders = async (req, res) => {
  try {
    console.log("Fetching orders for user:", req.user.userId);

    const userOrders = await Order.findOne({ user: req.user.userId })
      .populate({
        path: "user",
        select: "username email deliveryInfo",
      })
      .populate({
        path: "orders.items.product",
        select: "name price image description category",
      });

    if (!userOrders) {
      console.log("No orders found for user");
      return res.json({
        success: true,
        orders: [],
      });
    }

    const reversedOrders = [...userOrders.orders].reverse();
    const formattedOrders = reversedOrders.map((order) => ({
      orderId: order._id,
      paypalOrderId: order.paypalOrderId,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.product?._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product
          ? {
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              description: item.product.description,
              category: item.product.category,
            }
          : null,
      })),
      shippingInfo: {
        country: order.shippingInfo?.country,
        city: order.shippingInfo?.city,
        apartment: order.shippingInfo?.apartment,
        phoneNumber: order.shippingInfo?.phoneNumber,
      },
      payer: {
        email_address: order.payer?.email_address,
        payer_id: order.payer?.payer_id,
        name: {
          given_name: order.payer?.name?.given_name,
          surname: order.payer?.name?.surname,
        },
        address: {
          country_code: order.payer?.address?.country_code,
        },
      },
      user: userOrders.user
        ? {
            _id: userOrders.user._id,
            username: userOrders.user.username,
            email: userOrders.user.email,
            deliveryInfo: userOrders.user.deliveryInfo,
          }
        : null,
    }));

    console.log(`Found ${formattedOrders.length} orders for user`);
    res.json({
      success: true,
      orders: formattedOrders,
      totalOrders: formattedOrders.length,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const userOrders = await Order.findOne({
      user: req.user.userId,
      "orders._id": orderId,
    }).populate("user");

    if (!userOrders) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = userOrders.orders.find(
      (order) => order._id.toString() === orderId
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await userOrders.save();

    await sendOrderStatusEmail(userOrders.user, order, status);

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userOrders = await Order.findOne({
      user: req.user.userId,
    })
      .populate({
        path: "user",
        select: "username email deliveryInfo",
      })
      .populate({
        path: "orders.items.product",
        select: "name price image description category",
      });

    if (!userOrders) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    const order = userOrders.orders.find(
      (order) => order._id.toString() === req.params.orderId
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const formattedOrder = {
      orderId: order._id,
      paypalOrderId: order.paypalOrderId,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.product?._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product
          ? {
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              description: item.product.description,
              category: item.product.category,
            }
          : null,
      })),
      shippingInfo: {
        country: order.shippingInfo?.country,
        city: order.shippingInfo?.city,
        apartment: order.shippingInfo?.apartment,
        phoneNumber: order.shippingInfo?.phoneNumber,
      },
      payer: {
        email_address: order.payer?.email_address,
        payer_id: order.payer?.payer_id,
        name: {
          given_name: order.payer?.name?.given_name,
          surname: order.payer?.name?.surname,
        },
        address: {
          country_code: order.payer?.address?.country_code,
        },
      },
      user: userOrders.user
        ? {
            _id: userOrders.user._id,
            username: userOrders.user.username,
            email: userOrders.user.email,
            deliveryInfo: userOrders.user.deliveryInfo,
          }
        : null,
    };

    res.json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};
