import "dotenv/config";
import multer from "multer";
import { v2 as Cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// cloudinary config
Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: Cloudinary,
  params: {
    folder: "strive",
  },
});

const cloudinaryConfigMulter = multer({ storage: storage }); //storage key è da documentazione, il secondo storage è la variabile

export default cloudinaryConfigMulter;
