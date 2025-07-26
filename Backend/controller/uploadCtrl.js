const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    for (const file of files) {
      const { path } = file;
      try {
        const newpath = await uploader(path);
        console.log("Uploaded to Cloudinary:", newpath);
        urls.push(newpath);
        fs.unlinkSync(path); // delete local file after upload
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        fs.unlinkSync(path); // still delete even on failure
        return res.status(500).json({ message: "Cloudinary upload failed", error: uploadErr.message });
      }
    }

    res.status(200).json(urls);
  } catch (error) {
    console.error("Unexpected Upload Error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
