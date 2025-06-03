import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "./services/emailService.js";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { username, email, password, googleId } = req.body;

    // check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message:
          "Email already registered. Please use a different email or try logging in.",
        field: "email",
      });
    }

    // generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // create new user
    const newUser = new User({
      username,
      email,
      password,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false,
    });

    // save the user
    await newUser.save();

    try {
      await sendVerificationEmail(email, verificationToken);
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    res.status(201).json({
      message: "Please check your email to verify your account",
      success: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // add verification check
    if (!user.isVerified && !user.googleId) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, isGoogleUser: false },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800000,
    });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      googleId: user.googleId,
      createdAt: user.createdAt,
    };

    res.json({
      message: "Logged in successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Received verification request for token:", token);

    const now = new Date();

    const user = await User.findOne({
      $or: [
        { verificationToken: token },

        {
          email: req.query.email,
          isVerified: true,
          updatedAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
        },
      ],
    });

    if (!user) {
      console.log("No user found with this token");
      return res.status(400).json({
        success: false,
        status: "failed",
        reason: "invalid",
        message: "Invalid verification token",
      });
    }

    if (user.isVerified) {
      console.log("User already verified:", user.email);
      return res.status(200).json({
        success: true,
        status: "success",
        message: "Email already verified",
        email: user.email,
        alreadyVerified: true,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    console.log("Saving user verification status...");
    await user.save();
    console.log("User verified successfully:", user.email);

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Email verified successfully",
      email: user.email,
    });
  } catch (error) {
    console.error("Verification error details:", error);
    return res.status(500).json({
      success: false,
      status: "failed",
      reason: "error",
      message: "Server error during verification",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
        alreadyVerified: true,
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    try {
      await sendVerificationEmail(email, verificationToken);
      console.log("Verification email resent successfully");

      return res.status(200).json({
        success: true,
        message: "Verification email resent successfully",
      });
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Error sending verification email",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error resending verification email",
      error: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { sub, email, name, picture } = req.body;

    let user = await User.findOne({
      $or: [{ googleId: sub }, { email: email }],
    });

    if (!user) {
      user = new User({
        googleId: sub,
        email,
        username: name,
        profilePicture: picture,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = sub;
      user.profilePicture = picture;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 604800000,
    });

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        googleId: user.googleId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Error logging in with Google",
      error: error.message,
    });
  }
};

export const checkAuth = (req, res) => {
  res.json({ isAuthenticated: true, userId: req.user.userId });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
