// src/routes/category.routes.js
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getAllCategoriesWithTranslations
} from "../controllers/category.controller.js";

const router = express.Router();

/**
 * Public Routes
 */
// GET /api/categories?lang=en
router.get("/", getAllCategories);

// GET /api/categories/admin/all
router.get(
  "/all",
  authenticate,
  getAllCategoriesWithTranslations
);

// GET /api/categories/:id?lang=ar
router.get("/:id", getCategoryById);

/**
 * Admin Routes
 */

// POST /api/categories
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  addCategory
);

// PUT /api/categories/:id
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  updateCategory
);

// DELETE /api/categories/:id
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteCategory
);

export default router;