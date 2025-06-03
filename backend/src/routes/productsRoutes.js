import express from "express";
import {
  getProducts,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/get", getProducts);
router.post("/add", createProduct);

export default router;
