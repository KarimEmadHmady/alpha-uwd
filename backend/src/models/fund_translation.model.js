import con from "../config/index.js";

const FundTranslation = {
  /**
   * @param {number} fundId 
   * @param {object} translations - example: { ar: { name: '...', description: '...' }, en: { ... } }
   */
  bulkUpsert: (fundId, translations, callback) => {
    // All fields that are supported for translation
    const fields = [
      'name',
      'description',
      'currency',
      'subscription_frequency',
      'redemption_frequency',
      'minimum_initial',
      'Minimum_redemption_amount',
      'subscription_fee',
      'redemption_fee',
      'type',
      'annualfee',
      'fund_manager_name'
    ];
    const values = [];
    
    for (const [lang, data] of Object.entries(translations)) {
      for (const field of fields) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          values.push([fundId, field, lang, data[field]]);
        }
      }
    }

    if (values.length === 0) {
      return callback(null, { affectedRows: 0 });
    }

    const query = `
      INSERT INTO fund_translations (fund_id, field, lang, value)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        value = VALUES(value),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    con.query(query, [values], callback);
  },

  /**
   Fetch all translations for a specific fund
   */
  findByFundId: (fundId, lang = null, callback) => {
    let query = "SELECT * FROM fund_translations WHERE fund_id = ?";
    const params = [fundId];

    if (lang) {
      query += " AND lang = ?";
      params.push(lang);
    }

    con.query(query, params, callback);
  },

  /**
   Fetch a specific field translation
   */
  getFieldTranslation: (fundId, field, lang, callback) => {
    const query = `
      SELECT value FROM fund_translations 
      WHERE fund_id = ? AND field = ? AND lang = ?
    `;
    con.query(query, [fundId, field, lang], callback);
  },

  /**
   Delete all translations of a fund (happens automatically via ON DELETE CASCADE)
   */
  deleteByFundId: (fundId, callback) => {
    const query = "DELETE FROM fund_translations WHERE fund_id = ?";
    con.query(query, [fundId], callback);
  },

  /**
   Delete translations of a specific language for a fund
   */
  deleteByFundIdAndLang: (fundId, lang, callback) => {
    const query = "DELETE FROM fund_translations WHERE fund_id = ? AND lang = ?";
    con.query(query, [fundId, lang], callback);
  },

  /**
   Format translations into a structured object
   * @param {Array} rows - SQL
   * @returns { ar: { name: '...', description: '...' }, en: { ... } }
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
   * @param {object} fund 
   * @param {Array} translations 
   * @param {string} lang 
   * @param {string} defaultLang 
   */
  mergeTranslations: (fund, translations, lang = 'ar', defaultLang = 'ar') => {
    const formatted = FundTranslation.formatTranslations(translations);
    fund.translations = formatted;

    // All fields that are supported for translation
    const translatableFields = [
      'name',
      'description',
      'currency',
      'subscription_frequency',
      'redemption_frequency',
      'minimum_initial',
      'Minimum_redemption_amount',
      'subscription_fee',
      'redemption_fee',
      'type',
      'annualfee',
      'fund_manager_name'
    ];

    translatableFields.forEach(field => {
      if (formatted[lang] && formatted[lang][field]) {
        fund[field] = formatted[lang][field];
      } else if (formatted[defaultLang] && formatted[defaultLang][field]) {
        fund[field] = formatted[defaultLang][field];
      }
    });

    return fund;
  },

  /**
   get All fields that are supported for translation
   */
  getTranslatableFields: () => {
    return [
      'name',
      'description',
      'currency',
      'subscription_frequency',
      'redemption_frequency',
      'minimum_initial',
      'Minimum_redemption_amount',
      'subscription_fee',
      'redemption_fee',
      'type',
      'annualfee',
      'fund_manager_name'
    ];
  }
};

export default FundTranslation;



