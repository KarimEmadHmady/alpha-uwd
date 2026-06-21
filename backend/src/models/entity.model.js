// src/models/entity.model.js
import con from "../config/index.js";

const Entity = {

  create: (entityData, callback) => {
    const query = "INSERT INTO entities SET ?";
    con.query(query, entityData, callback);
  },


  bulkCreate: (entities, callback) => {
    if (!entities || entities.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const query = "INSERT INTO entities (fund_id, entname, link, imageent, display_order) VALUES ?";
    const values = entities.map((e, index) => [
      e.fund_id,
      e.entname,
      e.link || null,
      e.imageent || null,
      e.display_order !== undefined ? e.display_order : index + 1
    ]);
    con.query(query, [values], callback);
  },


  update: (id, entityData, callback) => {
    const query = "UPDATE entities SET ? WHERE id = ?";
    con.query(query, [entityData, id], callback);
  },


  delete: (id, callback) => {
    const query = "DELETE FROM entities WHERE id = ?";
    con.query(query, [id], callback);
  },


  deleteByFundId: (fundId, callback) => {
    const query = "DELETE FROM entities WHERE fund_id = ?";
    con.query(query, [fundId], callback);
  },


  findByFundId: (fundId, callback) => {
    const query = `
      SELECT * FROM entities 
      WHERE fund_id = ? 
      ORDER BY display_order ASC, id ASC
    `;
    con.query(query, [fundId], callback);
  },


  findById: (id, callback) => {
    const query = "SELECT * FROM entities WHERE id = ?";
    con.query(query, [id], callback);
  },


  findAll: (callback) => {
    const query = "SELECT * FROM entities ORDER BY fund_id, display_order ASC";
    con.query(query, callback);
  },


  reorder: (orderedIds, callback) => {
    if (!orderedIds || orderedIds.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const sql = `
      UPDATE entities
      SET display_order = CASE id
        ${orderedIds.map((id, i) => `WHEN ${id} THEN ${i + 1}`).join(" ")}
      END
      WHERE id IN (${orderedIds.join(",")})
    `;
    con.query(sql, callback);
  }
};

export default Entity;