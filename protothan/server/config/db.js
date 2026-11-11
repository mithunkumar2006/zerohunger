import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnecting = false;

const connectDB = async () => {
  // 1 = connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, wait for connection attempt to resolve
  if (isConnecting) {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(checkInterval);
          resolve(mongoose.connection);
        }
      }, 500);
      setTimeout(() => {
        clearInterval(checkInterval);
        if (mongoose.connection.readyState !== 1) {
          reject(new Error("MongoDB connection timeout during retry."));
        }
      }, 10000);
    });
  }

  isConnecting = true;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined in .env");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("======================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log("======================================");

    isConnecting = false;
    return conn.connection;
  } catch (error) {
    isConnecting = false;
    console.error("======================================");
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.error("======================================");
    throw error;
  }
};

// Listen for connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection lost. Retrying in 3 seconds...");
  setTimeout(() => {
    connectDB().catch((err) => {
      console.error("❌ Mongoose reconnection attempt failed:", err.message);
    });
  }, 3000);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose error:", err.message);
});

export default connectDB;