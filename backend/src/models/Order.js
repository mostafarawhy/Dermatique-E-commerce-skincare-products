import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orders: [
      {
        paypalOrderId: {
          type: String,
          required: true,
          unique: false, 
        },
        items: [orderItemSchema],
        totalAmount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: ["CREATED", "COMPLETED", "FAILED", "CANCELLED"],
        },
        payer: {
          email_address: String,
          payer_id: String,
          name: {
            given_name: String,
            surname: String,
          },
          address: {
            country_code: String,
          },
        },
        shippingInfo: {
          country: String,
          city: String,
          apartment: String,
          phoneNumber: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const Order = mongoose.model("Order", orderSchema);

Order.syncIndexes();

export default Order;
