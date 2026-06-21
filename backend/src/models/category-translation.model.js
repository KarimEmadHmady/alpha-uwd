// src/models/category-translation.model.js
import con from "../config/index.js";

const CategoryTranslation = {
  /**
   Create multiple translations at once
   * @param {number} categoryId 
   * @param {object} translations - example: { ar: { name: '...' }, en: { name: '...' } }
   */
  bulkUpsert: (categoryId, translations, callback) => {
    const fields = ['name']; 
    const values = [];
    
    for (const [lang, data] of Object.entries(translations)) {
      for (const field of fields) {
        if (data[field]) {
          values.push([categoryId, field, lang, data[field]]);
        }
      }
    }

    if (values.length === 0) {
      return callback(null, { affectedRows: 0 });
    }

    const query = `
      INSERT INTO category_translations (category_id, field, lang, value)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        value = VALUES(value),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    con.query(query, [values], callback);
  },

  /**
   Get all translations for a specific category
   */
  findByCategoryId: (categoryId, lang = null, callback) => {
    let query = "SELECT * FROM category_translations WHERE category_id = ?";
    const params = [categoryId];

    if (lang) {
      query += " AND lang = ?";
      params.push(lang);
    }

    con.query(query, params, callback);
  },

  /**
    Get translation of a specific field
   */
  getFieldTranslation: (categoryId, field, lang, callback) => {
    const query = `
      SELECT value FROM category_translations 
      WHERE category_id = ? AND field = ? AND lang = ?
    `;
    con.query(query, [categoryId, field, lang], callback);
  },

/**
   Delete all translations of a category
*/
  deleteByCategoryId: (categoryId, callback) => {
    const query = "DELETE FROM category_translations WHERE category_id = ?";
    con.query(query, [categoryId], callback);
  },

  /**
Format translations into a structured object
   * @param {Array} rows -   SQL
   * @returns { ar: { name: '...' }, en: { name: '...' } }
   */
  formatTranslations: (rows) => {
    const result = {};
    
    rows.forEach(row => {
      if (!result[row.lang]) {
        result[row.lang] = {};
      }
      result[row.lang][row.field] = row.value;
    });

    return result;
  },

  /**
Merge translations into the category object
   * @param {object} category  
   * @param {Array} translations   
   * @param {string} lang
   * @param {string} defaultLang 
   */
  mergeTranslations: (category, translations, lang = 'ar', defaultLang = 'ar') => {
    const formatted = CategoryTranslation.formatTranslations(translations);
    category.translations = formatted;

    const translatableFields = ['name'];

    translatableFields.forEach(field => {
      if (formatted[lang] && formatted[lang][field]) {
        category[field] = formatted[lang][field];
      } else if (formatted[defaultLang] && formatted[defaultLang][field]) {
        category[field] = formatted[defaultLang][field];
      }
    });

    return category;
  }
};

export default CategoryTranslation;