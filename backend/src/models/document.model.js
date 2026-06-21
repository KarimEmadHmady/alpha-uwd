// src/models/document.model.js
import con from "../config/index.js";

const Document = {

  create: (documentData, callback) => {
    const query = "INSERT INTO documents SET ?";
    con.query(query, documentData, callback);
  },

  bulkCreate: (documents, callback) => {
    if (!documents || documents.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const query = "INSERT INTO documents (fund_id, document, linkdoc, file_type, file_size, display_order) VALUES ?";
    const values = documents.map((d, index) => [
      d.fund_id,
      d.document,
      d.linkdoc,
      d.file_type || null,
      d.file_size || null,
      d.display_order !== undefined ? d.display_order : index + 1
    ]);
    con.query(query, [values], callback);
  },

  update: (id, documentData, callback) => {
    const query = "UPDATE documents SET ? WHERE id = ?";
    con.query(query, [documentData, id], callback);
  },

  delete: (id, callback) => {
    const query = "DELETE FROM documents WHERE id = ?";
    con.query(query, [id], callback);
  },


  deleteByFundId: (fundId, callback) => {
    const query = "DELETE FROM documents WHERE fund_id = ?";
    con.query(query, [fundId], callback);
  },


  findByFundId: (fundId, callback) => {
    const query = `
      SELECT * FROM documents 
      WHERE fund_id = ? 
      ORDER BY display_order ASC, upload_time DESC
    `;
    con.query(query, [fundId], callback);
  },


  findById: (id, callback) => {
    const query = "SELECT * FROM documents WHERE id = ?";
    con.query(query, [id], callback);
  },


  findAll: (callback) => {
    const query = "SELECT * FROM documents ORDER BY fund_id, display_order ASC";
    con.query(query, callback);
  },


  reorder: (orderedIds, callback) => {
    if (!orderedIds || orderedIds.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const sql = `
      UPDATE documents
      SET display_order = CASE id
        ${orderedIds.map((id, i) => `WHEN ${id} THEN ${i + 1}`).join(" ")}
      END
      WHERE id IN (${orderedIds.join(",")})
    `;
    con.query(sql, callback);
  },


  search: (searchTerm, callback) => {
    const query = `
      SELECT * FROM documents 
      WHERE document LIKE ? OR file_type LIKE ?
      ORDER BY upload_time DESC
    `;
    const term = `%${searchTerm}%`;
    con.query(query, [term, term], callback);
  }
};

export default Document;