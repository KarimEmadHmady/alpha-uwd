// src/routes/fund-manager.routes.js
import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole, authorizeAdmin } from "../middlewares/role.middleware.js";
import FundManagerController from "../controllers/fund-manager.controller.js";

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(undefined, true);
  },
});

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRole("admin", "manager"),
  upload.single("image"),
  FundManagerController.createManager
);

router.put(
  "/:id",
  authenticate,
  authorizeRole("admin", "manager"),
  upload.single("image"),
  FundManagerController.updateManager
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  FundManagerController.deleteManager
);

router.put(
  "/reorder",
  authenticate,
  authorizeAdmin,
  FundManagerController.reorderManagers
);

router.get(
  "/fund/:fundId",
  FundManagerController.getManagersByFundId
);

router.get(
  "/:id",
  FundManagerController.getManagerById
);

export default router;