// src/models/fund-manager.model.js
import con from "../config/index.js";

const FundManager = {
  /**
   Add a single fund manager
   */
  create: (managerData, callback) => {
    const query = "INSERT INTO fund_managers SET ?";
    con.query(query, managerData, callback);
  },

  /**
   Add multiple fund managers in batch
   */
  bulkCreate: (managers, callback) => {
    if (!managers || managers.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const query = "INSERT INTO fund_managers (fund_id, name, name_arabic, image, display_order) VALUES ?";
    const values = managers.map((m, index) => [
      m.fund_id,
      m.name,
      m.name_arabic || null,
      m.image || null,
      m.display_order !== undefined ? m.display_order : index + 1
    ]);
    con.query(query, [values], callback);
  },

  /**
   Update a fund manager
   */
  update: (id, managerData, callback) => {
    const query = "UPDATE fund_managers SET ? WHERE id = ?";
    con.query(query, [managerData, id], callback);
  },

  /**
   Delete a fund manager
   */
  delete: (id, callback) => {
    const query = "DELETE FROM fund_managers WHERE id = ?";
    con.query(query, [id], callback);
  },

  /**
   Delete all managers of a specific fund
   */
  deleteByFundId: (fundId, callback) => {
    const query = "DELETE FROM fund_managers WHERE fund_id = ?";
    con.query(query, [fundId], callback);
  },

  /**
   Fetch managers of a specific fund
   */
  findByFundId: (fundId, callback) => {
    const query = `
      SELECT * FROM fund_managers 
      WHERE fund_id = ? 
      ORDER BY display_order ASC, id ASC
    `;
    con.query(query, [fundId], callback);
  },

  /**
   Fetch a single fund manager
   */
  findById: (id, callback) => {
    const query = "SELECT * FROM fund_managers WHERE id = ?";
    con.query(query, [id], callback);
  },

  /**
   Update the order of fund managers
   */
  reorder: (orderedIds, callback) => {
    if (!orderedIds || orderedIds.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const sql = `
      UPDATE fund_managers
      SET display_order = CASE id
        ${orderedIds.map((id, i) => `WHEN ${id} THEN ${i + 1}`).join(" ")}
      END
      WHERE id IN (${orderedIds.join(",")})
    `;
    con.query(sql, callback);
  }
};

export default FundManager;