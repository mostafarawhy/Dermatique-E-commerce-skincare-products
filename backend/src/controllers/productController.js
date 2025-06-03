import Product from "../models/Product.js";
import { generateKeywords } from "./updateProductKeywords.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productsData = Array.isArray(req.body) ? req.body : [req.body];


    const productsWithKeywords = productsData.map((product) => ({
      ...product,
      keywords: generateKeywords(product),
    }));

    const createdProducts = await Product.insertMany(productsWithKeywords);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
