import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import authenticationRoutes from "./routes/authenticationRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import cookieParser from "cookie-parser";
import authenticateToken from "./middlewares/authMiddleware.js";
import cartRoutes from "./routes/cartRoutes.js";
import PaymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();

connectDB();

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const isAllowedVercelPreview = (origin) => {
  if (!origin) return false;
  return /^https:\/\/dermatique.*\.vercel\.app$/.test(origin);
};

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests like Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        allowedOrigins.includes(origin) || isAllowedVercelPreview(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to your API" });
});

app.use("/api/auth", authenticationRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", authenticateToken, cartRoutes);
app.use("/api/paypal", PaymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/search", searchRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message?.startsWith("CORS blocked for origin:")) {
    return res.status(403).json({
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : "🥞",
  });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const gracefulShutdown = async () => {
  console.log("Shutdown signal received: closing HTTP server");

  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown();
});

export default app;
