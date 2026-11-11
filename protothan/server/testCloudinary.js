import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env inside the server folder
const envResult = dotenv.config({
    path: path.join(__dirname, ".env"),
});

console.log("\n==============================");
console.log("🔍 DOTENV DEBUG");
console.log("==============================");

if (envResult.error) {
    console.error("❌ Failed to load .env");
    console.error(envResult.error);
    process.exit(1);
}

console.log("✅ .env Loaded Successfully");
console.log("Loaded from:", path.join(__dirname, ".env"));

console.log("\nEnvironment Variables:");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MongoDB:", !!process.env.MONGODB_URI);
console.log("JWT:", !!process.env.JWT_SECRET);
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log(
    "API Secret:",
    process.env.CLOUDINARY_API_SECRET
        ? "Loaded ✅"
        : "Missing ❌"
);

console.log("==============================\n");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
    console.log("☁️ Testing Cloudinary Connection...\n");

    const result = await cloudinary.api.ping();

    console.log("================================");
    console.log("🎉 CLOUDINARY CONNECTED");
    console.log("================================");
    console.log(result);
    console.log("================================");

} catch (err) {

    console.log("================================");
    console.log("❌ CLOUDINARY CONNECTION FAILED");
    console.log("================================");
    console.error(err);
    console.log("================================");

}