import dotenv from "dotenv";
import fs from "fs";
import Product from "./src/models/Product.js";
import connectDB from "./src/config/database.js";

dotenv.config();

const importProducts = async () => {
  try {
    await connectDB();

    const jsonData = fs.readFileSync("products.json", "utf-8");
    const products = JSON.parse(jsonData);

    await Product.deleteMany({});
    console.log("Existing products deleted");

    await Product.insertMany(products);
    console.log(`${products.length} products imported successfully`);

    process.exit();
  } catch (error) {
    console.error("Error importing products:", error);
    process.exit(1);
  }
};

importProducts();
