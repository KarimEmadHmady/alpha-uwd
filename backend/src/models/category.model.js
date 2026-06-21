// src/models/category.model.js
import con from "../config/index.js";

export const CategoryModel = {

  create: async (data) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO category SET ?";
      con.query(sql, data, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  update: async (id, data) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE category SET ? WHERE id = ?";
      con.query(sql, [data, id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  delete: async (id) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM category WHERE id = ?";
      con.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  /**
   * @param {string} lang - (ar or en)
   */
  getAll: async (lang = 'ar') => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.*,
          COALESCE(ct.value, c.name) as name
        FROM category c
        LEFT JOIN category_translations ct 
          ON c.id = ct.category_id 
          AND ct.field = 'name' 
          AND ct.lang = ?
        ORDER BY c.id ASC
      `;
      con.query(sql, [lang], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  /**
   * @param {number} id 
   * @param {string} lang 
   */
  getById: async (id, lang = 'ar') => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.*,
          COALESCE(ct.value, c.name) as name
        FROM category c
        LEFT JOIN category_translations ct 
          ON c.id = ct.category_id 
          AND ct.field = 'name' 
          AND ct.lang = ?
        WHERE c.id = ?
      `;
      con.query(sql, [lang, id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  /**
   Fetch all categories with all translations (for admin)
   */
  getAllWithTranslations: async () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM category ORDER BY id ASC";
      con.query(sql, (err, categories) => {
        if (err) return reject(err);

        if (categories.length === 0) {
          return resolve([]);
        }

        // Fetch all translations in a single batch
        const categoryIds = categories.map(c => c.id);
        const translationsSql = `
          SELECT * FROM category_translations 
          WHERE category_id IN (${categoryIds.join(',')})
        `;

        con.query(translationsSql, (err, translations) => {
          if (err) return reject(err);

          // Group translations by category_id
          const translationsByCategory = {};
          translations.forEach(t => {
            if (!translationsByCategory[t.category_id]) {
              translationsByCategory[t.category_id] = [];
            }
            translationsByCategory[t.category_id].push(t);
          });

          // Merge translations into the category objects
          const result = categories.map(category => {
            const categoryTranslations = translationsByCategory[category.id] || [];
            const formatted = {};

            categoryTranslations.forEach(t => {
              if (!formatted[t.lang]) {
                formatted[t.lang] = {};
              }
              formatted[t.lang][t.field] = t.value;
            });

            return {
              ...category,
              translations: formatted
            };
          });

          resolve(result);
        });
      });
    });
  }
};