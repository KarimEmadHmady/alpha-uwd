// src/controllers/fund-manager.controller.js
import FundManagerService from "../services/fund-manager.service.js";

const FundManagerController = {
/**
 * Add a fund manager
 * POST /api/fund-managers
 */
  createManager: async (req, res) => {
    try {
      const file = req.file;
      const results = await FundManagerService.createManager(req.body, file);
      res.status(201).json({ 
        success: 1, 
        message: "Fund manager created successfully", 
        data: results 
      });
    } catch (error) {
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: error.message 
      });
    }
  },

/**
 * Update a fund manager
 * PUT /api/fund-managers/:id
 */
  updateManager: async (req, res) => {
    try {
      const file = req.file;
      const results = await FundManagerService.updateManager(req.params.id, req.body, file);
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          success: 0, 
          message: "Fund manager not found" 
        });
      }

      res.json({ 
        success: 1, 
        message: "Fund manager updated successfully", 
        data: results 
      });
    } catch (error) {
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: error.message 
      });
    }
  },

/**
 * Delete a fund manager
 * DELETE /api/fund-managers/:id
 */
  deleteManager: async (req, res) => {
    try {
      const results = await FundManagerService.deleteManager(req.params.id);
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          success: 0, 
          message: "Fund manager not found" 
        });
      }

      res.json({ 
        success: 1, 
        message: "Fund manager deleted successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: error.message 
      });
    }
  },

/**
 * Get managers of a specific fund
 * GET /api/fund-managers/fund/:fundId
 */
  getManagersByFundId: async (req, res) => {
    try {
      const managers = await FundManagerService.getManagersByFundId(req.params.fundId);
      res.json({ 
        success: 1, 
        data: managers,
        count: managers.length
      });
    } catch (error) {
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: error.message 
      });
    }
  },

/**
 * Get a single fund manager
 * GET /api/fund-managers/:id
 */
  getManagerById: async (req, res) => {
    try {
      const manager = await FundManagerService.getManagerById(req.params.id);
      
      if (!manager) {
        return res.status(404).json({ 
          success: 0, 
          message: "Fund manager not found" 
        });
      }

      res.json({ 
        success: 1, 
        data: manager 
      });
    } catch (error) {
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: error.message 
      });
    }
  },

/**
 * Reorder fund managers
 * PUT /api/fund-managers/reorder
 */
  reorderManagers: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      
      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return res.status(400).json({ 
          success: 0, 
          message: "orderedIds must be a non-empty array" 
        });
      }

      const results = await FundManagerService.reorderManagers(orderedIds);
      res.json({ 
        success: 1, 
        message: "Managers reordered successfully",
        updated: results.affectedRows 
      });
    } catch (error) {
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: error.message 
      });
    }
  }
};

export default FundManagerController;