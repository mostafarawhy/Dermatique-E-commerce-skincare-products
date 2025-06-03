
import express from "express";
import {
  createPayPalOrder,
  capturePayment,
} from "../controllers/paymentController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authenticateToken, createPayPalOrder);
router.post("/capture-payment", authenticateToken, capturePayment);

export default router;
