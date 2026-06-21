import con from "../config/index.js";

export const PageContentModel = {
  /**
   * Get page content by page key
   * @param {string} page
   * @returns {Promise<object|null>}
   */
  getByPage: (page) =>
    new Promise((resolve, reject) => {
      const sql = "SELECT page, content, updated_at FROM page_contents WHERE page = ?";
      con.query(sql, [page], (err, rows) => {
        if (err) return reject(err);
        if (!rows || rows.length === 0) return resolve(null);

        // Ensure content is parsed as JS object
        const row = rows[0];
        let content = row.content;
        if (typeof content === "string") {
          try {
            content = JSON.parse(content);
          } catch {
            // keep as-is if parsing fails
          }
        }

        resolve({
          page: row.page,
          content,
          updated_at: row.updated_at,
        });
      });
    }),

  /**
   * Insert or update page content by page key
   * @param {string} page
   * @param {object} content
   * @returns {Promise<void>}
   */
  upsertByPage: (page, content) =>
    new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO page_contents (page, content)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          content = VALUES(content),
          updated_at = CURRENT_TIMESTAMP
      `;

      con.query(sql, [page, JSON.stringify(content)], (err) => {
        if (err) return reject(err);
        resolve();
      });
    }),
};


