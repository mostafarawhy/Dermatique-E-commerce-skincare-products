import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  emptyCart,
  mergeGuestCart,
} from "../controllers/cartController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticateToken, addToCart);
router.get("/", authenticateToken, getCart);
router.put("/update", authenticateToken, updateCartItem);
router.delete("/remove/:productId", authenticateToken, removeFromCart);
router.delete("/empty", authenticateToken, emptyCart);
router.post("/merge", authenticateToken, mergeGuestCart);

export default router;
