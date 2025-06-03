import express from "express";
import { getUserOrders, getOrderById } from "../controllers/orderController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getUserOrders);
router.get("/:orderId", authenticateToken, getOrderById);

export default router;
