import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME?.trim(),
  api_key: process.env.API_KEY?.trim(),
  api_secret: process.env.API_SECRET?.trim(),
});

console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.API_KEY);
console.log("API Secret:", process.env.API_SECRET );

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // delete local temp file AFTER successful upload
       fs.unlinkSync(localFilePath);
console.log("response ye he cloudinary ka  ======",response)
    return response; // { url, secure_url, ... }
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error?.message);

    // cleanup on failure
    
      fs.unlinkSync(localFilePath);
    
    return null;
  }
};

export default uploadOnCloudinary;
