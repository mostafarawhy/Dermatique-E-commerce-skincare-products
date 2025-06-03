import express from "express";
import {
  signup,
  login,
  logout,
  googleLogin,
  checkAuth,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authenticationController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", logout);
router.get("/check-auth", authenticateToken, checkAuth);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

export default router;
