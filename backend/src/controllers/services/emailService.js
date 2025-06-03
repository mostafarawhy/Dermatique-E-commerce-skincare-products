
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Email - Dermatique",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Welcome to Dermatique!</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p style="font-size: 16px;">Please verify your email by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #4CAF50; 
                        color: white; 
                        padding: 12px 25px; 
                        text-decoration: none; 
                        border-radius: 5px;
                        font-size: 16px;">
                Verify Email
              </a>
            </div>
            <p style="color: #666;">This link will expire in 24 hours.</p>
          </div>
        </div>
      `,
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// order confirmation email service
export const sendOrderConfirmation = async (email, order) => {
  try {
    await resend.emails.send({
      from: "Dermatique <noreply@yourdomain.com>",
      to: email,
      subject: "Order Confirmation",
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <h2>Order Details:</h2>
        <p>Order ID: ${order.paypalOrderId}</p>
        <p>Total Amount: $${order.totalAmount}</p>
        <h3>Items:</h3>
        ${order.items
          .map(
            (item) => `
          <div>
            <p>${item.name} x ${item.quantity}</p>
            <p>Price: $${item.price}</p>
          </div>
        `
          )
          .join("")}
        <p>Shipping to: ${order.shippingInfo.apartment} ${
        order.shippingInfo.city
      }, ${order.shippingInfo.country}</p>
      `,
    });
  } catch (error) {
    console.error("Error sending order confirmation:", error);
    throw error;
  }
};
