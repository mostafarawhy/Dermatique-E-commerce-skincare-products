import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "dermatique",
    });
    console.log("MongoDB connected successfully to dermatique database");

    try {
      await mongoose.connection.db
        .collection("orders")
        .dropIndex("paypalOrderId_1");
      console.log("Cleaned up existing indices");
    } catch (error) {
      console.log("Index cleanup completed or not needed");
    }

    try {
      await mongoose.connection.db
        .collection("orders")
        .createIndex({ user: 1 }, { background: true });
      console.log("Created necessary indices");
    } catch (indexError) {
      console.log("Indices already exist or creation skipped");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
