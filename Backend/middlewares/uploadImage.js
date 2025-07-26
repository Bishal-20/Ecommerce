const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

// Multer file filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

// Multer upload middleware
const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // 1MB limit
});

// Safe unlink helper with retries for Windows file locking issues
async function safeUnlink(filePath, retries = 5, delay = 100) {
  for (let i = 0; i < retries; i++) {
    try {
      await fsPromises.unlink(filePath);
      return;
    } catch (err) {
      if (err.code === "EBUSY" || err.code === "EPERM") {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err; // throw if not a lock issue
      }
    }
  }

  // ❗ Log but don't crash the app
  console.warn(`⚠️ WARNING: Failed to delete locked file: ${filePath}. It may be deleted manually later.`);
}
// Product image resize middleware
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();

  for (const file of req.files) {
    const resizedPath = path.join("public", "images", "products", file.filename);

    const imageBuffer = await sharp(file.path)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    await fsPromises.writeFile(resizedPath, imageBuffer);

    await safeUnlink(file.path);

    file.path = resizedPath;
  }

  next();
};

// Blog image resize middleware
const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();

  for (const file of req.files) {
    const resizedPath = path.join("public", "images", "blogs", file.filename);

    const imageBuffer = await sharp(file.path)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    await fsPromises.writeFile(resizedPath, imageBuffer);

    await safeUnlink(file.path);

    file.path = resizedPath;
  }

  next();
};

module.exports = {
  uploadPhoto,
  productImgResize,
  blogImgResize,
};
