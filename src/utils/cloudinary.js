import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilepath) => {
  try {
    if (!localFilepath) return null;

    const response = await cloudinary.uploader.upload(localFilepath, {
      resource_type: "auto",
    });

    console.log(`File has been uploaded on cloudinary : ${response.url}`);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilepath); //removes the locally saved temporarily file as upload got failed
    return null;
  }
};

export { uploadOnCloudinary };
