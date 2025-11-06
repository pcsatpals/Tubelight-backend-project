import dns from "dns";
dns.setServers(["8.8.8.8"]); // Google DNS
dns.setDefaultResultOrder("ipv4first");
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the file on cloudinary
    console.log("Uploading started ... ");
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    // console.log("Uploaded successfully", res, res.url);
    fs.unlinkSync(localFilePath); // Remove the locally saved temp file as the upload operation got failed
    return res;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(localFilePath); // Remove the locally saved temp file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
