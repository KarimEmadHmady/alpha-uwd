import con from "../config/index.js";

const Fund = {

  findAll: (limit, offset, lang = 'ar', callback) => {
    const countQuery = "SELECT COUNT(*) AS total FROM funds";
    
    const sqlQuery = `
      SELECT 
        f.*, 
        COALESCE(ft_name.value, f.name) AS name,
        COALESCE(ft_desc.value, f.description) AS description,
        COALESCE(ft_manager.value, f.fund_manager_name) AS fund_manager_name,
        COALESCE(ft_currency.value, f.currency) AS currency,
        COALESCE(ft_sub_freq.value, f.subscription_frequency) AS subscription_frequency,
        COALESCE(ft_red_freq.value, f.redemption_frequency) AS redemption_frequency,
        COALESCE(ft_type.value, f.type) AS type,
        COALESCE(ft_min_initial.value, f.minimum_initial) AS minimum_initial,
        COALESCE(ft_min_redemption.value, f.Minimum_redemption_amount) AS Minimum_redemption_amount,
        COALESCE(ft_sub_fee.value, f.subscription_fee) AS subscription_fee,
        COALESCE(ft_red_fee.value, f.redemption_fee) AS redemption_fee,
        COALESCE(ft_annual_fee.value, f.annualfee) AS annualfee,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(f.image, 'default-image.png') AS image
      FROM funds f
      LEFT JOIN users u ON f.userid = u.id
      LEFT JOIN fund_translations ft_name 
        ON f.id = ft_name.fund_id AND ft_name.field = 'name' AND ft_name.lang = ?
      LEFT JOIN fund_translations ft_desc 
        ON f.id = ft_desc.fund_id AND ft_desc.field = 'description' AND ft_desc.lang = ?
      LEFT JOIN fund_translations ft_manager 
        ON f.id = ft_manager.fund_id AND ft_manager.field = 'fund_manager_name' AND ft_manager.lang = ?
      LEFT JOIN fund_translations ft_currency 
        ON f.id = ft_currency.fund_id AND ft_currency.field = 'currency' AND ft_currency.lang = ?
      LEFT JOIN fund_translations ft_sub_freq 
        ON f.id = ft_sub_freq.fund_id AND ft_sub_freq.field = 'subscription_frequency' AND ft_sub_freq.lang = ?
      LEFT JOIN fund_translations ft_red_freq 
        ON f.id = ft_red_freq.fund_id AND ft_red_freq.field = 'redemption_frequency' AND ft_red_freq.lang = ?
      LEFT JOIN fund_translations ft_type 
        ON f.id = ft_type.fund_id AND ft_type.field = 'type' AND ft_type.lang = ?
      LEFT JOIN fund_translations ft_min_initial 
        ON f.id = ft_min_initial.fund_id AND ft_min_initial.field = 'minimum_initial' AND ft_min_initial.lang = ?
      LEFT JOIN fund_translations ft_min_redemption 
        ON f.id = ft_min_redemption.fund_id AND ft_min_redemption.field = 'Minimum_redemption_amount' AND ft_min_redemption.lang = ?
      LEFT JOIN fund_translations ft_sub_fee 
        ON f.id = ft_sub_fee.fund_id AND ft_sub_fee.field = 'subscription_fee' AND ft_sub_fee.lang = ?
      LEFT JOIN fund_translations ft_red_fee 
        ON f.id = ft_red_fee.fund_id AND ft_red_fee.field = 'redemption_fee' AND ft_red_fee.lang = ?
      LEFT JOIN fund_translations ft_annual_fee 
        ON f.id = ft_annual_fee.fund_id AND ft_annual_fee.field = 'annualfee' AND ft_annual_fee.lang = ?
      ORDER BY (f.sort_order IS NULL), f.sort_order ASC, f.id DESC 
      LIMIT ? OFFSET ?
    `;
    
    con.query(countQuery, (err, countResult) => {
      if (err) return callback(err);
      const totalFunds = countResult[0].total;
      // 12 lang parameters + limit + offset = 14 parameters
      con.query(sqlQuery, [
        lang, lang, lang, lang, lang, lang, lang, 
        lang, lang, lang, lang, lang, 
        limit, offset
      ], (err, rows) => {
        if (err) return callback(err);
        callback(null, { totalFunds, rows });
      });
    });
  },

  findAllNoPagination: (lang = 'ar', callback) => {
    const sqlQuery = `
      SELECT 
        f.*, 
        COALESCE(ft_name.value, f.name) AS name,
        COALESCE(ft_desc.value, f.description) AS description,
        COALESCE(ft_manager.value, f.fund_manager_name) AS fund_manager_name,
        COALESCE(ft_currency.value, f.currency) AS currency,
        COALESCE(ft_sub_freq.value, f.subscription_frequency) AS subscription_frequency,
        COALESCE(ft_red_freq.value, f.redemption_frequency) AS redemption_frequency,
        COALESCE(ft_type.value, f.type) AS type,
        COALESCE(ft_min_initial.value, f.minimum_initial) AS minimum_initial,
        COALESCE(ft_min_redemption.value, f.Minimum_redemption_amount) AS Minimum_redemption_amount,
        COALESCE(ft_sub_fee.value, f.subscription_fee) AS subscription_fee,
        COALESCE(ft_red_fee.value, f.redemption_fee) AS redemption_fee,
        COALESCE(ft_annual_fee.value, f.annualfee) AS annualfee,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(f.image, 'default-image.png') AS image
      FROM funds f
      LEFT JOIN users u ON f.userid = u.id
      LEFT JOIN fund_translations ft_name 
        ON f.id = ft_name.fund_id AND ft_name.field = 'name' AND ft_name.lang = ?
      LEFT JOIN fund_translations ft_desc 
        ON f.id = ft_desc.fund_id AND ft_desc.field = 'description' AND ft_desc.lang = ?
      LEFT JOIN fund_translations ft_manager 
        ON f.id = ft_manager.fund_id AND ft_manager.field = 'fund_manager_name' AND ft_manager.lang = ?
      LEFT JOIN fund_translations ft_currency 
        ON f.id = ft_currency.fund_id AND ft_currency.field = 'currency' AND ft_currency.lang = ?
      LEFT JOIN fund_translations ft_sub_freq 
        ON f.id = ft_sub_freq.fund_id AND ft_sub_freq.field = 'subscription_frequency' AND ft_sub_freq.lang = ?
      LEFT JOIN fund_translations ft_red_freq 
        ON f.id = ft_red_freq.fund_id AND ft_red_freq.field = 'redemption_frequency' AND ft_red_freq.lang = ?
      LEFT JOIN fund_translations ft_type 
        ON f.id = ft_type.fund_id AND ft_type.field = 'type' AND ft_type.lang = ?
      LEFT JOIN fund_translations ft_min_initial 
        ON f.id = ft_min_initial.fund_id AND ft_min_initial.field = 'minimum_initial' AND ft_min_initial.lang = ?
      LEFT JOIN fund_translations ft_min_redemption 
        ON f.id = ft_min_redemption.fund_id AND ft_min_redemption.field = 'Minimum_redemption_amount' AND ft_min_redemption.lang = ?
      LEFT JOIN fund_translations ft_sub_fee 
        ON f.id = ft_sub_fee.fund_id AND ft_sub_fee.field = 'subscription_fee' AND ft_sub_fee.lang = ?
      LEFT JOIN fund_translations ft_red_fee 
        ON f.id = ft_red_fee.fund_id AND ft_red_fee.field = 'redemption_fee' AND ft_red_fee.lang = ?
      LEFT JOIN fund_translations ft_annual_fee 
        ON f.id = ft_annual_fee.fund_id AND ft_annual_fee.field = 'annualfee' AND ft_annual_fee.lang = ?
      ORDER BY (f.sort_order IS NULL), f.sort_order ASC, f.id DESC
    `;
    con.query(sqlQuery, [
      lang, lang, lang, lang, lang, lang, lang,
      lang, lang, lang, lang, lang
    ], callback);
  },

  findPending: (limit, offset, lang = 'ar', callback) => {
    const query = `
      SELECT 
        f.*, 
        COALESCE(ft_name.value, f.name) AS name,
        COALESCE(ft_desc.value, f.description) AS description,
        COALESCE(ft_manager.value, f.fund_manager_name) AS fund_manager_name,
        COALESCE(ft_currency.value, f.currency) AS currency,
        COALESCE(ft_sub_freq.value, f.subscription_frequency) AS subscription_frequency,
        COALESCE(ft_red_freq.value, f.redemption_frequency) AS redemption_frequency,
        COALESCE(ft_type.value, f.type) AS type,
        COALESCE(ft_min_initial.value, f.minimum_initial) AS minimum_initial,
        COALESCE(ft_min_redemption.value, f.Minimum_redemption_amount) AS Minimum_redemption_amount,
        COALESCE(ft_sub_fee.value, f.subscription_fee) AS subscription_fee,
        COALESCE(ft_red_fee.value, f.redemption_fee) AS redemption_fee,
        COALESCE(ft_annual_fee.value, f.annualfee) AS annualfee,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(f.image, 'default-image.png') AS image
      FROM funds f
      LEFT JOIN users u ON f.userid = u.id
      LEFT JOIN fund_translations ft_name 
        ON f.id = ft_name.fund_id AND ft_name.field = 'name' AND ft_name.lang = ?
      LEFT JOIN fund_translations ft_desc 
        ON f.id = ft_desc.fund_id AND ft_desc.field = 'description' AND ft_desc.lang = ?
      LEFT JOIN fund_translations ft_manager 
        ON f.id = ft_manager.fund_id AND ft_manager.field = 'fund_manager_name' AND ft_manager.lang = ?
      LEFT JOIN fund_translations ft_currency 
        ON f.id = ft_currency.fund_id AND ft_currency.field = 'currency' AND ft_currency.lang = ?
      LEFT JOIN fund_translations ft_sub_freq 
        ON f.id = ft_sub_freq.fund_id AND ft_sub_freq.field = 'subscription_frequency' AND ft_sub_freq.lang = ?
      LEFT JOIN fund_translations ft_red_freq 
        ON f.id = ft_red_freq.fund_id AND ft_red_freq.field = 'redemption_frequency' AND ft_red_freq.lang = ?
      LEFT JOIN fund_translations ft_type 
        ON f.id = ft_type.fund_id AND ft_type.field = 'type' AND ft_type.lang = ?
      LEFT JOIN fund_translations ft_min_initial 
        ON f.id = ft_min_initial.fund_id AND ft_min_initial.field = 'minimum_initial' AND ft_min_initial.lang = ?
      LEFT JOIN fund_translations ft_min_redemption 
        ON f.id = ft_min_redemption.fund_id AND ft_min_redemption.field = 'Minimum_redemption_amount' AND ft_min_redemption.lang = ?
      LEFT JOIN fund_translations ft_sub_fee 
        ON f.id = ft_sub_fee.fund_id AND ft_sub_fee.field = 'subscription_fee' AND ft_sub_fee.lang = ?
      LEFT JOIN fund_translations ft_red_fee 
        ON f.id = ft_red_fee.fund_id AND ft_red_fee.field = 'redemption_fee' AND ft_red_fee.lang = ?
      LEFT JOIN fund_translations ft_annual_fee 
        ON f.id = ft_annual_fee.fund_id AND ft_annual_fee.field = 'annualfee' AND ft_annual_fee.lang = ?
      WHERE f.status = 0
      LIMIT ? OFFSET ?
    `;
    con.query(query, [
      lang, lang, lang, lang, lang, lang, lang,
      lang, lang, lang, lang, lang,
      limit, offset
    ], callback);
  },

  findApproved: (limit, offset, lang = 'ar', callback) => {
    const sql = `
      SELECT 
        f.*, 
        COALESCE(ft_name.value, f.name) AS name,
        COALESCE(ft_desc.value, f.description) AS description,
        COALESCE(ft_manager.value, f.fund_manager_name) AS fund_manager_name,
        COALESCE(ft_currency.value, f.currency) AS currency,
        COALESCE(ft_sub_freq.value, f.subscription_frequency) AS subscription_frequency,
        COALESCE(ft_red_freq.value, f.redemption_frequency) AS redemption_frequency,
        COALESCE(ft_type.value, f.type) AS type,
        COALESCE(ft_min_initial.value, f.minimum_initial) AS minimum_initial,
        COALESCE(ft_min_redemption.value, f.Minimum_redemption_amount) AS Minimum_redemption_amount,
        COALESCE(ft_sub_fee.value, f.subscription_fee) AS subscription_fee,
        COALESCE(ft_red_fee.value, f.redemption_fee) AS redemption_fee,
        COALESCE(ft_annual_fee.value, f.annualfee) AS annualfee,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(h.price, 0) AS latest_price,
        h.date AS latest_price_date,
        h.userid AS updated_by,
        COALESCE(f.image, 'default-image.png') AS image
      FROM funds f
      LEFT JOIN users u ON f.userid = u.id
      LEFT JOIN fund_translations ft_name 
        ON f.id = ft_name.fund_id AND ft_name.field = 'name' AND ft_name.lang = ?
      LEFT JOIN fund_translations ft_desc 
        ON f.id = ft_desc.fund_id AND ft_desc.field = 'description' AND ft_desc.lang = ?
      LEFT JOIN fund_translations ft_manager 
        ON f.id = ft_manager.fund_id AND ft_manager.field = 'fund_manager_name' AND ft_manager.lang = ?
      LEFT JOIN fund_translations ft_currency 
        ON f.id = ft_currency.fund_id AND ft_currency.field = 'currency' AND ft_currency.lang = ?
      LEFT JOIN fund_translations ft_sub_freq 
        ON f.id = ft_sub_freq.fund_id AND ft_sub_freq.field = 'subscription_frequency' AND ft_sub_freq.lang = ?
      LEFT JOIN fund_translations ft_red_freq 
        ON f.id = ft_red_freq.fund_id AND ft_red_freq.field = 'redemption_frequency' AND ft_red_freq.lang = ?
      LEFT JOIN fund_translations ft_type 
        ON f.id = ft_type.fund_id AND ft_type.field = 'type' AND ft_type.lang = ?
      LEFT JOIN fund_translations ft_min_initial 
        ON f.id = ft_min_initial.fund_id AND ft_min_initial.field = 'minimum_initial' AND ft_min_initial.lang = ?
      LEFT JOIN fund_translations ft_min_redemption 
        ON f.id = ft_min_redemption.fund_id AND ft_min_redemption.field = 'Minimum_redemption_amount' AND ft_min_redemption.lang = ?
      LEFT JOIN fund_translations ft_sub_fee 
        ON f.id = ft_sub_fee.fund_id AND ft_sub_fee.field = 'subscription_fee' AND ft_sub_fee.lang = ?
      LEFT JOIN fund_translations ft_red_fee 
        ON f.id = ft_red_fee.fund_id AND ft_red_fee.field = 'redemption_fee' AND ft_red_fee.lang = ?
      LEFT JOIN fund_translations ft_annual_fee 
        ON f.id = ft_annual_fee.fund_id AND ft_annual_fee.field = 'annualfee' AND ft_annual_fee.lang = ?
      LEFT JOIN (
        SELECT *
        FROM history h1
        WHERE id IN (
          SELECT MAX(id) FROM history GROUP BY fundid
        )
      ) h ON f.id = h.fundid
      WHERE f.status = 1
      ORDER BY h.date IS NULL, h.date DESC
      LIMIT ? OFFSET ?
    `;
    con.query(sql, [
      lang, lang, lang, lang, lang, lang, lang,
      lang, lang, lang, lang, lang,
      limit, offset
    ], callback);
  },

findById: (id, lang = 'ar', callback) => {
  const sql = `
    SELECT 
      f.*, 
      COALESCE(ft_name.value, f.name) AS name,
      COALESCE(ft_desc.value, f.description) AS description,
      COALESCE(ft_manager.value, f.fund_manager_name) AS fund_manager_name,
      COALESCE(ft_currency.value, f.currency) AS currency,
      COALESCE(ft_sub_freq.value, f.subscription_frequency) AS subscription_frequency,
      COALESCE(ft_red_freq.value, f.redemption_frequency) AS redemption_frequency,
      COALESCE(ft_type.value, f.type) AS type,
      COALESCE(ft_min_initial.value, f.minimum_initial) AS minimum_initial,
      COALESCE(ft_min_redemption.value, f.Minimum_redemption_amount) AS Minimum_redemption_amount,
      COALESCE(ft_sub_fee.value, f.subscription_fee) AS subscription_fee,
      COALESCE(ft_red_fee.value, f.redemption_fee) AS redemption_fee,
      COALESCE(ft_annual_fee.value, f.annualfee) AS annualfee,
      COALESCE(h.price, 0) AS latest_price, 
      h.date AS latest_price_date,
      COALESCE(u.username, 'Unknown') AS username, 
      COALESCE(u.email, '') AS email,                    -- ✅ أضف هنا
      COALESCE(u.bio, '') AS bio, 
      COALESCE(u.avatar, 'default-avatar.png') AS avatar,
      COALESCE(c.name, '') AS categoryName,
      COALESCE(f.image, 'default-image.png') AS image
    FROM funds f
    LEFT JOIN users u ON f.userid = u.id
    LEFT JOIN category c ON f.catid = c.id
    LEFT JOIN fund_translations ft_name 
      ON f.id = ft_name.fund_id AND ft_name.field = 'name' AND ft_name.lang = ?
    LEFT JOIN fund_translations ft_desc 
      ON f.id = ft_desc.fund_id AND ft_desc.field = 'description' AND ft_desc.lang = ?
    LEFT JOIN fund_translations ft_manager 
      ON f.id = ft_manager.fund_id AND ft_manager.field = 'fund_manager_name' AND ft_manager.lang = ?
    LEFT JOIN fund_translations ft_currency 
      ON f.id = ft_currency.fund_id AND ft_currency.field = 'currency' AND ft_currency.lang = ?
    LEFT JOIN fund_translations ft_sub_freq 
      ON f.id = ft_sub_freq.fund_id AND ft_sub_freq.field = 'subscription_frequency' AND ft_sub_freq.lang = ?
    LEFT JOIN fund_translations ft_red_freq 
      ON f.id = ft_red_freq.fund_id AND ft_red_freq.field = 'redemption_frequency' AND ft_red_freq.lang = ?
    LEFT JOIN fund_translations ft_type 
      ON f.id = ft_type.fund_id AND ft_type.field = 'type' AND ft_type.lang = ?
    LEFT JOIN fund_translations ft_min_initial 
      ON f.id = ft_min_initial.fund_id AND ft_min_initial.field = 'minimum_initial' AND ft_min_initial.lang = ?
    LEFT JOIN fund_translations ft_min_redemption 
      ON f.id = ft_min_redemption.fund_id AND ft_min_redemption.field = 'Minimum_redemption_amount' AND ft_min_redemption.lang = ?
    LEFT JOIN fund_translations ft_sub_fee 
      ON f.id = ft_sub_fee.fund_id AND ft_sub_fee.field = 'subscription_fee' AND ft_sub_fee.lang = ?
    LEFT JOIN fund_translations ft_red_fee 
      ON f.id = ft_red_fee.fund_id AND ft_red_fee.field = 'redemption_fee' AND ft_red_fee.lang = ?
    LEFT JOIN fund_translations ft_annual_fee 
      ON f.id = ft_annual_fee.fund_id AND ft_annual_fee.field = 'annualfee' AND ft_annual_fee.lang = ?
    LEFT JOIN history h ON h.id = (
      SELECT MAX(id) 
      FROM history 
      WHERE fundid = f.id
    )
    WHERE f.id = ?
  `;
  con.query(sql, [
    lang, lang, lang, lang, lang, lang, lang,
    lang, lang, lang, lang, lang,
    id
  ], callback);
},

  create: (fundData, callback) => {
    const query = "INSERT INTO funds SET ?";
    con.query(query, fundData, callback);
  },

  update: (id, fundData, callback) => {
    const query = "UPDATE funds SET ? WHERE id = ?";
    con.query(query, [fundData, id], callback);
  },

  updatePrice: (id, currentprice, newprice, callback) => {
    const query = "UPDATE funds SET currentprice = ?, newprice = ? WHERE id = ?";
    con.query(query, [currentprice, newprice, id], callback);
  },

  updatePriceWithStatus: (id, currentprice, newprice, status, callback) => {
    const query = "UPDATE funds SET currentprice = ?, newprice = ?, status = ? WHERE id = ?";
    con.query(query, [currentprice, newprice, status, id], callback);
  },

  addPriceHistory: (historyData, callback) => {
    const query = "INSERT INTO history SET ?";
    con.query(query, historyData, callback);
  },

  updateStatus: (id, status, callback) => {
    const query = "UPDATE funds SET status = ? WHERE id = ?";
    con.query(query, [status, id], callback);
  },

  delete: (id, callback) => {
    const query = "DELETE FROM funds WHERE id = ?";
    con.query(query, [id], callback);
  },

  findByUser: (userId, limit, offset, callback) => {
    const query = "SELECT * FROM `funds` WHERE userid = ? LIMIT ? OFFSET ?";
    con.query(query, [userId, limit, offset], callback);
  },

  reorder: (orderedIds, callback) => {
    if (!orderedIds.length) return callback(null, { affectedRows: 0 });
    const sql = `
      UPDATE funds
      SET sort_order = CASE id
        ${orderedIds.map((id, i) => `WHEN ${id} THEN ${i + 1}`).join(" ")}
      END
      WHERE id IN (${orderedIds.join(",")})
    `;
    con.query(sql, callback);
  },

  findFundForEmail: (id, callback) => {
    const query = `
      SELECT 
        funds.name AS fundname, 
        COALESCE(users.username, 'Unknown') AS username, 
        users.email
      FROM funds
      LEFT JOIN users ON funds.userid = users.id
      WHERE funds.id = ?
    `;
    con.query(query, [id], callback);
  },

  findHistory: (filters = {}, limit, offset, callback) => {
    let whereConditions = [];
    let queryParams = [];

    if (filters.fundid) {
      whereConditions.push('h.fundid = ?');
      queryParams.push(filters.fundid);
    }

    if (filters.userid) {
      whereConditions.push('h.userid = ?');
      queryParams.push(filters.userid);
    }

    if (filters.date) {
      whereConditions.push('DATE(h.date) = ?');
      queryParams.push(filters.date);
    }

    if (filters.startDate) {
      whereConditions.push('DATE(h.date) >= ?');
      queryParams.push(filters.startDate);
    }
    if (filters.endDate) {
      whereConditions.push('DATE(h.date) <= ?');
      queryParams.push(filters.endDate);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM history h
      ${whereClause}
    `;

    const dataQuery = `
      SELECT 
        h.*,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(f.name, 'Unknown Fund') AS fund_name,
        COALESCE(f.image, 'default-image.png') AS fund_image
      FROM history h
      LEFT JOIN users u ON h.userid = u.id
      LEFT JOIN funds f ON h.fundid = f.id
      ${whereClause}
      ORDER BY h.date DESC, h.id DESC
      LIMIT ? OFFSET ?
    `;

    con.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);
      
      const total = countResult[0].total;
      
      con.query(dataQuery, [...queryParams, limit, offset], (err, rows) => {
        if (err) return callback(err);
        callback(null, { total, rows });
      });
    });
  },

  findHistoryByFund: (fundid, limit, offset, callback) => {
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM history 
      WHERE fundid = ?
    `;

    const dataQuery = `
      SELECT 
        h.*,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar
      FROM history h
      LEFT JOIN users u ON h.userid = u.id
      WHERE h.fundid = ?
      ORDER BY h.date DESC, h.id DESC
      LIMIT ? OFFSET ?
    `;

    con.query(countQuery, [fundid], (err, countResult) => {
      if (err) return callback(err);
      
      const total = countResult[0].total;
      
      con.query(dataQuery, [fundid, limit, offset], (err, rows) => {
        if (err) return callback(err);
        callback(null, { total, rows });
      });
    });
  },

  findHistoryByUser: (userid, limit, offset, callback) => {
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM history 
      WHERE userid = ?
    `;

    const dataQuery = `
      SELECT 
        h.*,
        COALESCE(f.name, 'Unknown Fund') AS fund_name,
        COALESCE(f.image, 'default-image.png') AS fund_image
      FROM history h
      LEFT JOIN funds f ON h.fundid = f.id
      WHERE h.userid = ?
      ORDER BY h.date DESC, h.id DESC
      LIMIT ? OFFSET ?
    `;

    con.query(countQuery, [userid], (err, countResult) => {
      if (err) return callback(err);
      
      const total = countResult[0].total;
      
      con.query(dataQuery, [userid, limit, offset], (err, rows) => {
        if (err) return callback(err);
        callback(null, { total, rows });
      });
    });
  },


  findHistoryByDate: (startDate, endDate, limit, offset, callback) => {
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM history 
      WHERE DATE(date) BETWEEN ? AND ?
    `;

    const dataQuery = `
      SELECT 
        h.*,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(f.name, 'Unknown Fund') AS fund_name,
        COALESCE(f.image, 'default-image.png') AS fund_image
      FROM history h
      LEFT JOIN users u ON h.userid = u.id
      LEFT JOIN funds f ON h.fundid = f.id
      WHERE DATE(h.date) BETWEEN ? AND ?
      ORDER BY h.date DESC, h.id DESC
      LIMIT ? OFFSET ?
    `;

    con.query(countQuery, [startDate, endDate], (err, countResult) => {
      if (err) return callback(err);
      
      const total = countResult[0].total;
      
      con.query(dataQuery, [startDate, endDate, limit, offset], (err, rows) => {
        if (err) return callback(err);
        callback(null, { total, rows });
      });
    });
  },

  // src/models/fund.model.js

deleteLastHistory: (fundid, callback) => {
  const query = `
    DELETE FROM history 
    WHERE id = (
      SELECT id FROM (
        SELECT id 
        FROM history 
        WHERE fundid = ? 
        ORDER BY created_at DESC, id DESC 
        LIMIT 1
      ) AS temp
    )
  `;
  
  con.query(query, [fundid], callback);
},

  findLastTwoDates: (fundid, callback) => {
    const query = `
      SELECT 
        h.*,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(f.name, 'Unknown Fund') AS fund_name,
        COALESCE(f.image, 'default-image.png') AS fund_image
      FROM history h
      LEFT JOIN users u ON h.userid = u.id
      LEFT JOIN funds f ON h.fundid = f.id
      WHERE h.fundid = ?
      ORDER BY h.id DESC
      LIMIT 2
    `;

    con.query(query, [fundid], (err, rows) => {
      if (err) return callback(err);
      
      if (rows.length === 0) {
        return callback(null, { latest: null, previous: null });
      }

      const result = {
        latest: rows[0] ? {
          ...rows[0],
          label: 'التحديث الأخير',
          label_en: 'Latest update'
        } : null,
        previous: rows[1] ? {
          ...rows[1],
          label: 'قبل التحديث الأخير',
          label_en: 'Previous update'
        } : null
      };

      callback(null, result);
    });
  },

  /**
   * Find funds by category ID
   * @param {number} categoryId - Category ID
   * @param {string} lang - Language (ar or en)
   * @param {function} callback - Callback function
   */
  findByCategory: (categoryId, lang = 'ar', callback) => {
    const sql = `
      SELECT 
        f.*, 
        COALESCE(ft_name.value, f.name) AS name,
        COALESCE(ft_desc.value, f.description) AS description,
        COALESCE(ft_manager.value, f.fund_manager_name) AS fund_manager_name,
        COALESCE(ft_currency.value, f.currency) AS currency,
        COALESCE(ft_sub_freq.value, f.subscription_frequency) AS subscription_frequency,
        COALESCE(ft_red_freq.value, f.redemption_frequency) AS redemption_frequency,
        COALESCE(ft_type.value, f.type) AS type,
        COALESCE(ft_min_initial.value, f.minimum_initial) AS minimum_initial,
        COALESCE(ft_min_redemption.value, f.Minimum_redemption_amount) AS Minimum_redemption_amount,
        COALESCE(ft_sub_fee.value, f.subscription_fee) AS subscription_fee,
        COALESCE(ft_red_fee.value, f.redemption_fee) AS redemption_fee,
        COALESCE(ft_annual_fee.value, f.annualfee) AS annualfee,
        COALESCE(u.username, 'Unknown') AS username,
        COALESCE(u.avatar, 'default-avatar.png') AS avatar,
        COALESCE(c.name, '') AS categoryName,
        COALESCE(f.image, 'default-image.png') AS image
      FROM funds f
      LEFT JOIN users u ON f.userid = u.id
      LEFT JOIN category c ON f.catid = c.id
      LEFT JOIN fund_translations ft_name 
        ON f.id = ft_name.fund_id AND ft_name.field = 'name' AND ft_name.lang = ?
      LEFT JOIN fund_translations ft_desc 
        ON f.id = ft_desc.fund_id AND ft_desc.field = 'description' AND ft_desc.lang = ?
      LEFT JOIN fund_translations ft_manager 
        ON f.id = ft_manager.fund_id AND ft_manager.field = 'fund_manager_name' AND ft_manager.lang = ?
      LEFT JOIN fund_translations ft_currency 
        ON f.id = ft_currency.fund_id AND ft_currency.field = 'currency' AND ft_currency.lang = ?
      LEFT JOIN fund_translations ft_sub_freq 
        ON f.id = ft_sub_freq.fund_id AND ft_sub_freq.field = 'subscription_frequency' AND ft_sub_freq.lang = ?
      LEFT JOIN fund_translations ft_red_freq 
        ON f.id = ft_red_freq.fund_id AND ft_red_freq.field = 'redemption_frequency' AND ft_red_freq.lang = ?
      LEFT JOIN fund_translations ft_type 
        ON f.id = ft_type.fund_id AND ft_type.field = 'type' AND ft_type.lang = ?
      LEFT JOIN fund_translations ft_min_initial 
        ON f.id = ft_min_initial.fund_id AND ft_min_initial.field = 'minimum_initial' AND ft_min_initial.lang = ?
      LEFT JOIN fund_translations ft_min_redemption 
        ON f.id = ft_min_redemption.fund_id AND ft_min_redemption.field = 'Minimum_redemption_amount' AND ft_min_redemption.lang = ?
      LEFT JOIN fund_translations ft_sub_fee 
        ON f.id = ft_sub_fee.fund_id AND ft_sub_fee.field = 'subscription_fee' AND ft_sub_fee.lang = ?
      LEFT JOIN fund_translations ft_red_fee 
        ON f.id = ft_red_fee.fund_id AND ft_red_fee.field = 'redemption_fee' AND ft_red_fee.lang = ?
      LEFT JOIN fund_translations ft_annual_fee 
        ON f.id = ft_annual_fee.fund_id AND ft_annual_fee.field = 'annualfee' AND ft_annual_fee.lang = ?
      WHERE f.catid = ?
      ORDER BY (f.sort_order IS NULL), f.sort_order ASC, f.id DESC
    `;
    con.query(sql, [
      lang, lang, lang, lang, lang, lang, lang,
      lang, lang, lang, lang, lang,
      categoryId
    ], callback);
  }
  
};

export default Fund;