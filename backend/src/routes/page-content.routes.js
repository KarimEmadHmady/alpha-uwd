import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import {
  uploadPageContentImages,
  handleMulterErrors,
} from "../middlewares/multer.middleware.js";
import {
  getPageContent,
  updatePageContent,
} from "../controllers/page-content.controller.js";

const router = express.Router();

/**
 * Public read-only endpoint for page content.
 * GET /alpha/api/page-content/:page
 */
router.get("/:page", getPageContent);


router.put(
  "/:page",
  authenticate,
  authorizeAdmin,
  uploadPageContentImages.any(), 
  handleMulterErrors,
  updatePageContent
);

export default router;


