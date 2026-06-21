import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole, authorizeAdmin } from "../middlewares/role.middleware.js";
import FundController from "../controllers/fund.controller.js";

const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter(req, file, cb) {
    const allowedExtensions = /\.(jpg|jpeg|png|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i;

    if (!file.originalname.match(allowedExtensions)) {
      return cb(new Error("Please upload a valid file type"));
    }
    cb(undefined, true);
  },
});

const router = express.Router();

// ============ Fund Routes ============

// Create fund
router.post(
  "/",
  authenticate,
  authorizeRole("admin", "manager"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "fund_manager_image", maxCount: 1 },
  ]),
  FundController.createFund
);

// Reorder funds
router.put("/reorder", authenticate, authorizeAdmin, FundController.reorderFunds);

// Update fund
router.put(
  "/:id",
  authenticate,
  authorizeRole("admin", "manager"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "fund_manager_image", maxCount: 1 },
  ]),
  FundController.updateFund
);

// Update fund price
router.put("/:id/price", authenticate, authorizeRole("admin", "manager"), FundController.updateFundPrice);

// Update fund status (approve/reject)
router.put("/status/:id", authenticate, authorizeAdmin, FundController.updateFundStatus);

// Decline fund with message
router.put("/status/decline/:id", authenticate, authorizeAdmin, FundController.declineFundStatus);

// Delete fund
router.delete("/:id", authenticate, authorizeAdmin, FundController.deleteFund);

// Get current user's funds
router.get("/me", authenticate, authorizeRole("admin", "manager"), FundController.getFundsForUser);

// ============ History Routes ============

/**
 * Get history with flexible filters
 * Examples:
 * - /api/funds/history?page=1
 * - /api/funds/history?page=1&fundid=5
 * - /api/funds/history?page=1&userid=2
 * - /api/funds/history?page=1&date=2025-01-15
 * - /api/funds/history?page=1&startDate=2025-01-01&endDate=2025-01-31
 * - /api/funds/history?page=1&fundid=5&startDate=2025-01-01
 */
router.get("/history", FundController.getHistory);


/**
 * Get history by date or date range
 * Examples:
 * - /api/funds/history/date?date=2025-01-15&page=1
 * - /api/funds/history/date?startDate=2025-01-01&endDate=2025-01-31&page=1
 */
router.get("/history/date", FundController.getHistoryByDate);

/**
 * Get history for specific user
 * Example: /api/funds/history/user/2?page=1
 */
router.get("/history/user/:userid", FundController.getHistoryByUser);

// Get all funds (paginated)
router.get("/", FundController.getAllFunds);

// Get all funds (no pagination)
router.get("/all", FundController.getAllFundsNoPagination);

// Get pending funds
router.get("/status", FundController.getPendingFunds);

// Get approved funds
router.get("/approved", FundController.getApprovedFunds);

/**
 * Get funds by category
 * Example: /api/funds/category/1?lang=en
 */
router.get("/category/:categoryId", FundController.getFundsByCategory);

/**
 * Get history for specific fund
 * Example: /api/funds/5/history?page=1
 */
router.get("/:id/history", FundController.getHistoryByFund);


/**
 * Get last 2 dates only for a specific fund (without full records)
 * Example: /api/funds/5/history/last-two-dates
 * Returns: { fundid: 5, latest: "2025-11-05", previous: "2025-11-04" }
 */
router.get("/:id/history/last-two-dates", FundController.getLastTwoDates);

// Get fund details
router.get("/:id", FundController.getFundDetails);

export default router;