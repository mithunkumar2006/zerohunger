import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload Image to Cloudinary
 */
export const uploadImage = async (filePath) => {
  try {
    console.log("=========== CLOUDINARY ===========");
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("API Key:", process.env.CLOUDINARY_API_KEY);
    console.log(
      "Secret Exists:",
      !!process.env.CLOUDINARY_API_SECRET
    );

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "food-rescue/donations",
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
    });

    console.log("✅ Uploaded Successfully");
    console.log(result.secure_url);
    console.log("=================================");

    return result.secure_url;

  } catch (error) {

    console.error("❌ Cloudinary Upload Error");
    console.error(error);

    throw error;
  }
};

/**
 * Delete Image
 */
export const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Cloudinary Delete Error");
    console.error(error);
    throw error;
  }
};