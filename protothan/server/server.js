import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import seedDemoUsers from "./config/seedDemoUsers.js";

import authRoutes from "./routes/auth.js";
import donationRoutes from "./routes/donations.js";
import deliveryRoutes from "./routes/deliveries.js";
import analyticsRoutes from "./routes/analytics.js";
import userRoutes from "./routes/users.js";
import { uploadImage } from "./services/cloudinaryService.js";

dotenv.config();

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect MongoDB then seed demo users
connectDB()
  .then(() => {
    seedDemoUsers();
  })
  .catch((err) => {
    console.error("⚠️ Initial DB connection attempt failed:", err.message);
  });

const app = express();

// Database connection status check middleware
app.use(async (req, res, next) => {
  if (req.path === "/" || req.path === "/api/health") {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(503).json({
        success: false,
        error: "Database connection unavailable. Please check server connectivity.",
      });
    }
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image file" });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const url = await uploadImage(req.file.path);
        fs.unlinkSync(req.file.path);
        return res.json({ url });
      } catch (err) {
        console.warn("Cloudinary upload failed, falling back to local file:", err);
      }
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const url = `${protocol}://${host}/uploads/${req.file.filename}`;
    return res.json({ url });
  } catch (error) {
    next(error);
  }
});

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Powered Smart Food Rescue Network API",
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server Running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log("🚀 AI Powered Smart Food Rescue API");
  console.log("======================================");
  console.log(`✅ Server Running : http://localhost:${PORT}`);
  console.log(`❤️ Health Check   : http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API       : /api/auth`);
  console.log(`🍱 Donations API  : /api/donations`);
  console.log(`🚚 Deliveries API : /api/deliveries`);
  console.log(`📊 Analytics API  : /api/analytics`);
  console.log(`👥 Users API      : /api/users`);
  console.log("======================================");
});

export default app;