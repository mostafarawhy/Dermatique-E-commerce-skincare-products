import express from "express";
import {
  getUsers,
  createUser,
  getCurrentUser,
  updateDeliveryInfo,
  deleteUser,
} from "../controllers/userController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/current", authenticateToken, getCurrentUser);
router.post("/update-delivery-info", authenticateToken, updateDeliveryInfo);
router.delete("/delete-account", authenticateToken, deleteUser);

export default router;
