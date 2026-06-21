import FundService from "../services/fund.service.js";

/**
 * Helper: extract language from the request
 */
const getLanguage = (req) => {
  let lang = null;

  // 1️⃣ First: If "lang" exists in the query, use it
  if (req.query.lang && ['ar', 'en'].includes(req.query.lang)) {
    lang = req.query.lang;
  }

  // 2️⃣ Second: Check the Accept-Language header
  if (req.headers['accept-language']) {
    const headerLang = req.headers['accept-language']
      .split(',')[0]
      .split('-')[0];

    if (['ar', 'en'].includes(headerLang)) {
      // If both query and header exist → prioritize query
      lang = lang || headerLang;
    }
  }

  // 3️⃣ Third: Use the user's saved preferred language
  if (req.user?.preferred_lang && ['ar', 'en'].includes(req.user.preferred_lang)) {
    // Do not override if query already provided
    lang = lang || req.user.preferred_lang;
  }

  // 4️⃣ Finally: default to Arabic
  return lang || 'ar';
};



const FundController = {
  createFund: async (req, res) => {
    try {
      const results = await FundService.createFund(req.body, req.files, req.user);
      res.status(201).json({ 
        success: 1, 
        message: "Fund created", 
        data: results 
      });
    } catch (e) {
      res.status(500).json({ 
        success: 0, 
        message: "Server error", 
        error: e.message 
      });
    }
  },

  updateFund: async (req, res) => {
    try {
      const results = await FundService.updateFund(req.params.id, req.body, req.files, req.user);
      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          success: 0, 
          message: "Fund not found" 
        });
      }
      res.json({ 
        success: 1, 
        message: "Fund updated successfully", 
        results 
      });
    } catch (e) {
      res.status(500).json({ 
        success: 0, 
        message: "An unexpected error occurred", 
        error: e.message 
      });
    }
  },

  updateFundPrice: async (req, res) => {
    try {
      const { newprice, date } = req.body;
      
      if (typeof newprice === 'undefined' || !date) {
        return res.status(400).json({ 
          success: 0, 
          message: "newprice and date are required." 
        });
      }
      
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ 
          success: 0, 
          message: "Invalid date format. Use YYYY-MM-DD format." 
        });
      }
      
      const newStatus = req.user.role === 'admin' ? 1 : 0;
      
      const results = await FundService.updateFundPrice(
        req.params.id, 
        req.user.id, 
        newprice, 
        date,
        newStatus
      );
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          success: 0, 
          message: "Fund not found" 
        });
      }
      
      res.json({ 
        success: 1, 
        message: `Fund price updated successfully. Status: ${newStatus === 1 ? 'Approved' : 'Pending'}`, 
        results,
        status: newStatus
      });
    } catch (e) {
      res.status(500).json({ 
        success: 0, 
        message: "An unexpected error occurred", 
        error: e.message 
      });
    }
  },

  updateFundStatus: async (req, res) => {
    try {
      const status = Number(req.body.status);
      if (isNaN(status)) {
        return res.status(400).json({ 
          error: "Status must be a number" 
        });
      }
      await FundService.updateFundStatus(req.params.id, status, req.user.id);
      res.send('Success Edit');
    } catch (e) {
      res.status(400).send(e.message);
    }
  },

  declineFundStatus: async (req, res) => {
    try {
      const { message } = req.body;
      if(!message) return res.status(400).json({
        error: "Message is required"
      });
      await FundService.declineFundStatus(req.params.id, message);
      res.send('Success Edit Status');
    } catch (e) {
      res.status(400).send(e.message);
    }
  },

  deleteFund: async (req, res) => {
    try {
      await FundService.deleteFund(req.params.id);
      res.send('Delete fund success');
    } catch (e) {
      res.status(500).send({ 
        error: "Internal Server Error" 
      });
    }
  },

  getFundsForUser: async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      if (isNaN(page) || page < 1) {
        return res.status(400).send({ 
          error: "Invalid page number" 
        });
      }
      const funds = await FundService.getFundsForUser(req.user.id, page);
      res.send(funds);
    } catch (e) {
      res.status(500).send({ 
        error: "Internal Server Error" 
      });
    }
  },

  getAllFunds: async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      if (isNaN(page) || page < 1) {
        return res.status(400).send({ 
          error: "Invalid page number" 
        });
      }
      const lang = getLanguage(req);
      const funds = await FundService.getAllFunds(page, lang);
      res.send(funds);
    } catch (e) {
      res.status(500).send({ 
        error: "Internal Server Error" 
      });
    }
  },

  getAllFundsNoPagination: async (req, res) => {
    try {
      const lang = getLanguage(req);
      const funds = await FundService.getAllFundsNoPagination(lang);
      res.send(funds);
    } catch (e) {
      res.status(500).send({ 
        error: "Internal Server Error" 
      });
    }
  },

  reorderFunds: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if(!Array.isArray(orderedIds) || !orderedIds.length){
        return res.status(400).json({ 
          success: 0, 
          message: 'orderedIds must be a non-empty array of integers' 
        });
      }
      const result = await FundService.reorderFunds(orderedIds);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: 0, 
          message: 'No rows were updated. Check if IDs exist in database.' 
        });
      }
      res.json({ 
        success: 1, 
        updated: result.affectedRows 
      });
    } catch (e) {
      res.status(500).json({ 
        success: 0, 
        message: 'Unexpected server error', 
        detail: e.message 
      });
    }
  },

  getPendingFunds: async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      if (isNaN(page) || page < 1) {
        return res.status(400).send({ 
          error: "Invalid page number" 
        });
      }
      const lang = getLanguage(req);
      const funds = await FundService.getPendingFunds(page, lang);
      res.send(funds);
    } catch (e) {
      res.status(500).send({ 
        error: "Internal Server Error" 
      });
    }
  },

  getApprovedFunds: async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      if (isNaN(page) || page < 1) {
        return res.status(400).send({ 
          error: "Invalid page number" 
        });
      }
      const lang = getLanguage(req);
      const funds = await FundService.getApprovedFunds(page, lang);
      res.send(funds);
    } catch (e) {
      res.status(500).send({ 
        error: "Internal Server Error" 
      });
    }
  },

  getFundDetails: async (req, res) => {
    try {
      const lang = getLanguage(req);
      const details = await FundService.getFundDetails(req.params.id, lang);
      res.send(details);
    } catch (e) {
      res.status(500).send();
    }
  },

  // ============ History Controllers ============

  /**
   * Get history with flexible filtering
   * GET /api/funds/history?page=1&fundid=5&userid=2&date=2025-01-15
   * GET /api/funds/history?page=1&startDate=2025-01-01&endDate=2025-01-31
   * GET /api/funds/history?page=1&fundid=5&startDate=2025-01-01
   */
  getHistory: async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ 
          success: 0,
          error: "Invalid page number" 
        });
      }

      // Build filters object from query parameters
      const filters = {};
      
      if (req.query.fundid) {
        const fundid = parseInt(req.query.fundid);
        if (isNaN(fundid)) {
          return res.status(400).json({ 
            success: 0,
            error: "fundid must be a number" 
          });
        }
        filters.fundid = fundid;
      }

      if (req.query.userid) {
        const userid = parseInt(req.query.userid);
        if (isNaN(userid)) {
          return res.status(400).json({ 
            success: 0,
            error: "userid must be a number" 
          });
        }
        filters.userid = userid;
      }

      // Validate date formats
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (req.query.date) {
        if (!dateRegex.test(req.query.date)) {
          return res.status(400).json({ 
            success: 0,
            error: "Invalid date format. Use YYYY-MM-DD" 
          });
        }
        filters.date = req.query.date;
      }

      if (req.query.startDate) {
        if (!dateRegex.test(req.query.startDate)) {
          return res.status(400).json({ 
            success: 0,
            error: "Invalid startDate format. Use YYYY-MM-DD" 
          });
        }
        filters.startDate = req.query.startDate;
      }

      if (req.query.endDate) {
        if (!dateRegex.test(req.query.endDate)) {
          return res.status(400).json({ 
            success: 0,
            error: "Invalid endDate format. Use YYYY-MM-DD" 
          });
        }
        filters.endDate = req.query.endDate;
      }

      const history = await FundService.getHistory(page, filters);
      res.json(history);
    } catch (e) {
      res.status(500).json({ 
        success: 0,
        error: "Internal Server Error",
        details: e.message 
      });
    }
  },

  /**
   * Get history for specific fund
   * GET /api/funds/:id/history?page=1
   */
  getHistoryByFund: async (req, res) => {
    try {
      const fundid = parseInt(req.params.id);
      const page = req.query.page ? parseInt(req.query.page) : 1;
      
      if (isNaN(fundid)) {
        return res.status(400).json({ 
          success: 0,
          error: "Invalid fund ID" 
        });
      }

      if (isNaN(page) || page < 1) {
        return res.status(400).json({ 
          success: 0,
          error: "Invalid page number" 
        });
      }

      const history = await FundService.getHistoryByFund(fundid, page);
      res.json(history);
    } catch (e) {
      res.status(500).json({ 
        success: 0,
        error: "Internal Server Error",
        details: e.message 
      });
    }
  },

  /**
   * Get history for specific user
   * GET /api/funds/history/user/:userid?page=1
   */
  getHistoryByUser: async (req, res) => {
    try {
      const userid = parseInt(req.params.userid);
      const page = req.query.page ? parseInt(req.query.page) : 1;
      
      if (isNaN(userid)) {
        return res.status(400).json({ 
          success: 0,
          error: "Invalid user ID" 
        });
      }

      if (isNaN(page) || page < 1) {
        return res.status(400).json({ 
          success: 0,
          error: "Invalid page number" 
        });
      }

      const history = await FundService.getHistoryByUser(userid, page);
      res.json(history);
    } catch (e) {
      res.status(500).json({ 
        success: 0,
        error: "Internal Server Error",
        details: e.message 
      });
    }
  },

  /**
   * Get history by date range
   * GET /api/funds/history/date?startDate=2025-01-01&endDate=2025-01-31&page=1
   * GET /api/funds/history/date?date=2025-01-15&page=1
   */
  getHistoryByDate: async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ 
          success: 0,
          error: "Invalid page number" 
        });
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      let startDate, endDate;

      // If single date provided
      if (req.query.date) {
        if (!dateRegex.test(req.query.date)) {
          return res.status(400).json({ 
            success: 0,
            error: "Invalid date format. Use YYYY-MM-DD" 
          });
        }
        startDate = req.query.date;
        endDate = req.query.date;
      } else {
        // Date range
        if (!req.query.startDate) {
          return res.status(400).json({ 
            success: 0,
            error: "startDate or date is required" 
          });
        }

        if (!dateRegex.test(req.query.startDate)) {
          return res.status(400).json({ 
            success: 0,
            error: "Invalid startDate format. Use YYYY-MM-DD" 
          });
        }

        startDate = req.query.startDate;
        endDate = req.query.endDate || startDate;

        if (req.query.endDate && !dateRegex.test(req.query.endDate)) {
          return res.status(400).json({ 
            success: 0,
            error: "Invalid endDate format. Use YYYY-MM-DD" 
          });
        }
      }

      const history = await FundService.getHistoryByDate(startDate, endDate, page);
      res.json(history);
    } catch (e) {
      res.status(500).json({ 
        success: 0,
        error: "Internal Server Error",
        details: e.message 
      });
    }
  },

  
  /**
   * Get last 2 dates only (without records) for a specific fund
   * GET /api/funds/:id/history/last-two-dates
   */
  getLastTwoDates: async (req, res) => {
    try {
      const fundid = parseInt(req.params.id);
      
      if (isNaN(fundid)) {
        return res.status(400).json({ 
          success: 0,
          error: "Invalid fund ID" 
        });
      }

      const dates = await FundService.getLastTwoDates(fundid);
      res.json(dates);
    } catch (e) {
      res.status(500).json({ 
        success: 0,
        error: "Internal Server Error",
        details: e.message 
      });
    }
  },

  /**
   * Get all funds by category
   * GET /api/funds/category/:categoryId?lang=en
   */
  getFundsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const lang = getLanguage(req);

      const id = parseInt(categoryId);
      if (isNaN(id) || id < 1) {
        return res.status(400).json({
          success: 0,
          message: "Category ID must be a valid number"
        });
      }

      const result = await FundService.getFundsByCategory(id, lang);

      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: 0,
        message: "Internal server error",
        error: err.message
      });
    }
  },

};

export default FundController;