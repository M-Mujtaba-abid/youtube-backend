import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

 cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME , 
        api_key: process.env.API_KEY , 
        api_secret:  process.env.API_SECRET  // Click 'View API Keys' above to copy your API secret
    });



const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

     // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    console.log("✅ File uploaded on Cloudinary:", response.url);

    // file has been uploaded successfully 
    console.log("file has been uploaded successfully ",response.url)
    return response;

    // Local file delete after upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);

    // Local file delete if exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;




    //   // Upload an image
    //  const uploadResult = await cloudinary.uploader.upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);