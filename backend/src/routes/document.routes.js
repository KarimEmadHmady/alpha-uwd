// src/routes/document.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole, authorizeAdmin } from "../middlewares/role.middleware.js";
import { DocumentController } from "../controllers/document.controller.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i;
    if (!file.originalname.match(allowedExtensions)) {
      return cb(new Error("Only document files are allowed"));
    }
    cb(undefined, true);
  },
});

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRole("admin", "manager"),
  upload.single("file"),
  DocumentController.createDocument
);

router.put(
  "/:id",
  authenticate,
  authorizeRole("admin", "manager"),
  upload.single("file"),
  DocumentController.updateDocument
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  DocumentController.deleteDocument
);

router.put(
  "/reorder",
  authenticate,
  authorizeAdmin,
  DocumentController.reorderDocuments
);

router.get(
  "/search",
  DocumentController.searchDocuments
);

router.get(
  "/fund/:fundId",
  DocumentController.getDocumentsByFundId
);

router.get(
  "/all",
  DocumentController.getAllDocuments
);

router.get(
  "/:id",
  DocumentController.getDocumentById
);

export default router;