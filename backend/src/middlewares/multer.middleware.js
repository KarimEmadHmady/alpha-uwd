import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const ensureUploadDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Multer configuration for page content images
 * Stores images in uploads/Contant-page folder
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(
      __dirname,
      "../../uploads/Contant-page"
    );
    ensureUploadDirExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-original-name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed. Received: ${file.mimetype}`
      ),
      false
    );
  }
};

/**
 * Multer middleware for page content images
 * Usage: uploadPageContentImages.single('image') or .array('images')
 */
export const uploadPageContentImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/**
 * Error handler for multer errors
 * Use in routes after multer middleware
 */
export const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: 0,
        message: "File size exceeds 5MB limit",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: 0,
        message: "Too many files",
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: 0,
      message: err.message,
    });
  }

  next();
};
