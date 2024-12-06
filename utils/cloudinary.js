const { v2: cloudinary } = require("cloudinary");
const { response } = require("express");
const fs = require("fs");
require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (filePath) => {
  try {
    if (!filePath) return "file path not found";

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath); // removing the locally uploaded file after uploading to cloudinary.
    console.log(error);
    return null;
  }
};

module.exports = { uploadCloudinary };
