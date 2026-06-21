// src/services/document.service.js
import Document from "../models/document.model.js";
import fs from "fs/promises";
import path from "path";

const saveDocument = async (file) => {
  if (!file) return null;
  
  const ext = path.extname(file.originalname);
  const filename = `document-${Date.now()}${ext}`;
  const filepath = `http://revamp.alpha-odin.com/alpha/uploads/documents/${filename}`;
  
  await fs.writeFile(filepath, file.buffer);
  
  return {
    filepath,
    file_type: ext.replace('.', ''),
    file_size: file.size
  };
};

const DocumentService = {
  
// src/services/document.service.js

createDocument: async (data, file) => {
  // Validate required fields
  if (!data.fund_id) {
    throw new Error('fund_id is required');
  }
  
  if (!data.document) {
    throw new Error('document name is required');
  }
  
  if (!file) {
    throw new Error('file is required');
  }

  const documentData = {
    fund_id: data.fund_id,
    document: data.document, 
    linkdoc: file.path.replace(/\\/g, '/'), 
    file_type: file.mimetype,
    file_size: file.size,
    display_order: data.display_order || 0
  };

  return new Promise((resolve, reject) => {
    Document.create(documentData, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
},

  bulkCreateDocuments: async (fundId, documents, files) => {
    const documentsData = await Promise.all(
      documents.map(async (doc, index) => {
        const file = files && files[index] ? files[index] : null;
        const fileInfo = await saveDocument(file);
        return {
          fund_id: fundId,
          document: doc.document,
          linkdoc: fileInfo ? fileInfo.filepath : doc.linkdoc,
          file_type: fileInfo ? fileInfo.file_type : null,
          file_size: fileInfo ? fileInfo.file_size : null,
          display_order: doc.display_order || index + 1
        };
      })
    );

    return new Promise((resolve, reject) => {
      Document.bulkCreate(documentsData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


// src/services/document.service.js

updateDocument: async (id, data, file) => {
  const documentData = {};

  // Update document name if provided
  if (data.document) {
    documentData.document = data.document;
  }

  // Update display_order if provided
  if (data.display_order !== undefined) {
    documentData.display_order = data.display_order;
  }

  // If new file uploaded, update file info
  if (file) {
    documentData.linkdoc = file.path.replace(/\\/g, '/');
    documentData.file_type = file.mimetype;
    documentData.file_size = file.size;
  }

  // Check if there's anything to update
  if (Object.keys(documentData).length === 0) {
    throw new Error('No data to update');
  }

  return new Promise((resolve, reject) => {
    Document.update(id, documentData, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
},


  deleteDocument: async (id) => {
    const document = await new Promise((resolve, reject) => {
      Document.findById(id, (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });

    if (document && document.linkdoc && document.linkdoc.startsWith('uploads/')) {
      try {
        await fs.unlink(document.linkdoc);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    return new Promise((resolve, reject) => {
      Document.delete(id, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  getDocumentsByFundId: (fundId) => {
    return new Promise((resolve, reject) => {
      Document.findByFundId(fundId, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },


  getDocumentById: (id) => {
    return new Promise((resolve, reject) => {
      Document.findById(id, (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  },


  getAllDocuments: () => {
    return new Promise((resolve, reject) => {
      Document.findAll((err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },


  reorderDocuments: (orderedIds) => {
    return new Promise((resolve, reject) => {
      Document.reorder(orderedIds, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  searchDocuments: (searchTerm) => {
    return new Promise((resolve, reject) => {
      Document.search(searchTerm, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

export default DocumentService;