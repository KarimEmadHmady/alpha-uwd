
// src/routes/entity.routes.js
import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole, authorizeAdmin } from "../middlewares/role.middleware.js";
import { EntityController } from "../controllers/entity.controller.js";

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
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
  upload.single("imageent"),
  EntityController.createEntity
);

router.put(
  "/:id",
  authenticate,
  authorizeRole("admin", "manager"),
  upload.single("imageent"),
  EntityController.updateEntity
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  EntityController.deleteEntity
);

router.put(
  "/reorder",
  authenticate,
  authorizeAdmin,
  EntityController.reorderEntities
);

router.get(
  "/fund/:fundId",
  EntityController.getEntitiesByFundId
);

router.get(
  "/all",
  EntityController.getAllEntities
);

router.get(
  "/:id",
  EntityController.getEntityById
);

export default router;
