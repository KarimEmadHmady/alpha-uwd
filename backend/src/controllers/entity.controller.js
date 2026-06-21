// src/controllers/entity.controller.js
import EntityService from "../services/entity.service.js";

export const EntityController = {
  createEntity: async (req, res) => {
    try {
      const file = req.file;
      const results = await EntityService.createEntity(req.body, file);
      res.status(201).json({ success: 1, message: "Entity created successfully", data: results });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  updateEntity: async (req, res) => {
    try {
      const file = req.file;
      const results = await EntityService.updateEntity(req.params.id, req.body, file);
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: 0, message: "Entity not found" });
      }
      res.json({ success: 1, message: "Entity updated successfully", data: results });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  deleteEntity: async (req, res) => {
    try {
      const results = await EntityService.deleteEntity(req.params.id);
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: 0, message: "Entity not found" });
      }
      res.json({ success: 1, message: "Entity deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  getEntitiesByFundId: async (req, res) => {
    try {
      const entities = await EntityService.getEntitiesByFundId(req.params.fundId);
      res.json({ success: 1, data: entities, count: entities.length });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  getEntityById: async (req, res) => {
    try {
      const entity = await EntityService.getEntityById(req.params.id);
      if (!entity) {
        return res.status(404).json({ success: 0, message: "Entity not found" });
      }
      res.json({ success: 1, data: entity });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  getAllEntities: async (req, res) => {
    try {
      const entities = await EntityService.getAllEntities();
      res.json({ success: 1, data: entities, count: entities.length });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  reorderEntities: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return res.status(400).json({ success: 0, message: "orderedIds must be a non-empty array" });
      }
      const results = await EntityService.reorderEntities(orderedIds);
      res.json({ success: 1, message: "Entities reordered successfully", updated: results.affectedRows });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  }
};

