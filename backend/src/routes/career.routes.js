import express from "express";
import multer from "multer";
import path from "path";
import { CareerController } from "../controllers/career.controller.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `cv-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
      return cb(new Error("Only PDF or DOC files are allowed"));
    }
    cb(null, true);
  }
});

const router = express.Router();

/**
 * Public endpoint - Submit job application
 * POST /alpha/api/careers/apply
 */
router.post("/apply", upload.single("cv"), CareerController.submitApplication);

export default router;
