import express from "express";
import {
  getProductSuggestions,
  searchProducts,
} from "../controllers/searchController.js"; 

const router = express.Router();

router.get("/products", searchProducts);
router.get("/suggestions", getProductSuggestions);

export default router;
