import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message:
          "Email already registered. Please use a different email or try logging in.",
        field: "email",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpiry: undefined,
    });

    await newUser.save();

    res.status(201).json({
      message: "Account created successfully",
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
      { expiresIn: "1w" },
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
        isVerified: true,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = sub;
      user.profilePicture = picture;
      user.isVerified = true;
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
