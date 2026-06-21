// src/controllers/document.controller.js
import DocumentService from "../services/document.service.js";

export const DocumentController = {
createDocument: async (req, res) => {
    try {
      // Validate inputs
      if (!req.body.fund_id) {
        return res.status(400).json({ 
          success: 0, 
          message: "fund_id is required" 
        });
      }

      if (!req.body.document) {
        return res.status(400).json({ 
          success: 0, 
          message: "document name is required" 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: 0, 
          message: "file is required" 
        });
      }

      const results = await DocumentService.createDocument(req.body, req.file);
      
      res.status(201).json({ 
        success: 1, 
        message: "Document created successfully", 
        data: results 
      });
    } catch (error) {
      console.error("Create document error:", error);
      
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: error.message 
      });
    }
  },

// src/controllers/document.controller.js

updateDocument: async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that at least one field is provided
    if (!req.body.document && !req.body.display_order && !req.file) {
      return res.status(400).json({ 
        success: 0, 
        message: "At least one field (document, display_order, or file) must be provided" 
      });
    }

    const results = await DocumentService.updateDocument(id, req.body, req.file);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        success: 0, 
        message: "Document not found" 
      });
    }

    res.json({ 
      success: 1, 
      message: "Document updated successfully", 
      data: results 
    });
  } catch (error) {
    console.error("Update document error:", error);
    
    res.status(500).json({ 
      success: 0, 
      message: "Server error", 
      error: error.message 
    });
  }
},
  deleteDocument: async (req, res) => {
    try {
      const results = await DocumentService.deleteDocument(req.params.id);
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: 0, message: "Document not found" });
      }
      res.json({ success: 1, message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  getDocumentsByFundId: async (req, res) => {
    try {
      const documents = await DocumentService.getDocumentsByFundId(req.params.fundId);
      res.json({ success: 1, data: documents, count: documents.length });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  getDocumentById: async (req, res) => {
    try {
      const document = await DocumentService.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ success: 0, message: "Document not found" });
      }
      res.json({ success: 1, data: document });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  getAllDocuments: async (req, res) => {
    try {
      const documents = await DocumentService.getAllDocuments();
      res.json({ success: 1, data: documents, count: documents.length });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  reorderDocuments: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return res.status(400).json({ success: 0, message: "orderedIds must be a non-empty array" });
      }
      const results = await DocumentService.reorderDocuments(orderedIds);
      res.json({ success: 1, message: "Documents reordered successfully", updated: results.affectedRows });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  },

  searchDocuments: async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ success: 0, message: "Search query is required" });
      }
      const documents = await DocumentService.searchDocuments(query);
      res.json({ success: 1, data: documents, count: documents.length });
    } catch (error) {
      res.status(500).json({ success: 0, message: "Server error", error: error.message });
    }
  }
};