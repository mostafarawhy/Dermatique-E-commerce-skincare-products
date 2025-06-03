import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 },
    image: { type: String },
    keywords: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "products" }
);

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  keywords: "text",
});

const Product = mongoose.model("Product", productSchema);

export default Product;
