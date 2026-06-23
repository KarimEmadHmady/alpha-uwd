import Fund from "../models/fund.model.js";
import FundTranslation from "../models/fund_translation.model.js";
import sharp from "sharp";
import nodemailer from "nodemailer";
import con from '../config/index.js';
import { EmailService } from './email.service.js';

const processImage = async (file) => {
  if (!file) return null;
  const imageFilename = `image-${Date.now()}.jpeg`;
  await sharp(file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`http://revamp.alpha-odin.com/alpha/uploads/${imageFilename}`);
   // الرابط اللي هيتخزن في الداتا بيز
  const imageUrl = `http://revamp.alpha-odin.com/alpha/uploads/${imageFilename}`;

  return imageUrl;
};

const sendFundStatusUpdateEmail = async (username, email, fundName, updateDate, message, messageAdmin) => {
    // If email credentials are missing, skip silently — don't crash the app
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn('[Email] Skipping email — EMAIL_USER or EMAIL_PASSWORD not set in environment variables.');
        return;
    }

    var resetURL = 'https://uwd.agency/clients/alpha/control-alpha/index.html';
    var logo = 'https://uwd.agency/clients/alpha/wp-content/uploads/2024/06/cropped-logo.png';

    var smtpTransport = nodemailer.createTransport({
        host: 'mail.alpha-odin.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    var mailOptions1 = {
        to: email || process.env.EMAIL_USER,
        from: process.env.EMAIL_USER,
        subject: message,
        html: `...`
    };

    var mailOptions2 = {
        to: 'karimkarim20444@gmail.com',
        from: process.env.EMAIL_USER,
        subject: messageAdmin,
        html: `...`
    };

    try {
        await smtpTransport.sendMail(mailOptions1);
        await smtpTransport.sendMail(mailOptions2);
        console.log('[Email] Fund status emails sent successfully.');
    } catch (err) {
        // Log the error but never crash the app
        console.error('[Email] Failed to send fund status email:', err.message);
    }
};

const FundService = {
// ==================== CREATE FUND ====================
createFund: async (data, files, user) => {
  const { 
    name, name_ar, name_en, 
    description, description_ar, description_en,
    fund_manager_name, fund_manager_name_ar, fund_manager_name_en,
    currentprice, 
    currency, currency_ar, currency_en, 
    subscription_frequency, subscription_frequency_ar, subscription_frequency_en,
    redemption_frequency, redemption_frequency_ar, redemption_frequency_en,
    minimum_initial, Minimum_redemption_amount, 
    subscription_fee, redemption_fee, 
    type, type_ar, type_en, 
    annualfee, catid, fund_link, created_at 
  } = data;

  const imagePath = await processImage(files.image ? files.image[0] : null);
  const fundManagerImagePath = await processImage(files.fund_manager_image ? files.fund_manager_image[0] : null);

  const datenow = created_at ? new Date(created_at) : new Date();

  const fundData = {
    name: name || name_ar || name_en,
    description: description || description_ar || description_en,
    fund_manager_name: fund_manager_name || fund_manager_name_ar || fund_manager_name_en,
    currentprice,
    currency: currency || currency_ar || currency_en,
    subscription_frequency: subscription_frequency || subscription_frequency_ar || subscription_frequency_en || "N/A",
    redemption_frequency: redemption_frequency || redemption_frequency_ar || redemption_frequency_en || "N/A",
    minimum_initial: minimum_initial || "0",
    Minimum_redemption_amount: Minimum_redemption_amount || "0",
    subscription_fee: subscription_fee || "0",
    redemption_fee: redemption_fee || "0",
    type: type || type_ar || type_en,
    annualfee,
    catid,
    fund_manager_image: fundManagerImagePath,
    image: imagePath,
    fund_link,
    userid: user.id,
    status: user.role === "admin" ? 1 : 0,
    created_at: datenow,
  };

  return new Promise((resolve, reject) => {
    Fund.create(fundData, (err, results) => {
      if (err) return reject(err);
      
      const fundId = results.insertId;
      
      const translations = {
        ar: {
          name: name_ar || name,
          description: description_ar || description,
          fund_manager_name: fund_manager_name_ar || fund_manager_name,
          currency: currency_ar || currency,  
          subscription_frequency: subscription_frequency_ar || subscription_frequency,
          redemption_frequency: redemption_frequency_ar || redemption_frequency,
          type: type_ar || type
        },
        en: {
          name: name_en || name,
          description: description_en || description,
          fund_manager_name: fund_manager_name_en || fund_manager_name,
          currency: currency_en || currency,  
          subscription_frequency: subscription_frequency_en || subscription_frequency,
          redemption_frequency: redemption_frequency_en || redemption_frequency,
          type: type_en || type
        }
      };

      Object.keys(translations).forEach(lang => {
        Object.keys(translations[lang]).forEach(field => {
          if (!translations[lang][field]) {
            delete translations[lang][field];
          }
        });
        if (Object.keys(translations[lang]).length === 0) {
          delete translations[lang];
        }
      });

      if (Object.keys(translations).length > 0) {
        FundTranslation.bulkUpsert(fundId, translations, (err, transResults) => {
          if (err) {
            console.error('Translation insert error:', err);
          }
          sendFundStatusUpdateEmail(
            user.name, 
            user.email, 
            name || name_ar, 
            datenow.toLocaleString(), 
            "Your fund has been added and is awaiting admin approval.", 
            "A new fund has been added and is awaiting your approval."
          );
          resolve(results);
        });
      } else {
        sendFundStatusUpdateEmail(
          user.name, 
          user.email, 
          name || name_ar, 
          datenow.toLocaleString(), 
          "Your fund has been added and is awaiting admin approval.", 
          "A new fund has been added and is awaiting your approval."
        );
        resolve(results);
      }
    });
  });
},

updateFund: async (id, data, files, user) => {
  const { 
    name, name_ar, name_en, 
    description, description_ar, description_en,
    fund_manager_name, fund_manager_name_ar, fund_manager_name_en,
    currentprice, 
    currency, currency_ar, currency_en,  
    subscription_frequency, subscription_frequency_ar, subscription_frequency_en, 
    redemption_frequency, redemption_frequency_ar, redemption_frequency_en,  
    minimum_initial, Minimum_redemption_amount, 
    subscription_fee, redemption_fee, 
    type, type_ar, type_en,  
    annualfee, catid, fund_link, created_at 
  } = data;

  const imagePath = await processImage(files.image ? files.image[0] : null);
  const fundManagerImagePath = await processImage(files.fund_manager_image ? files.fund_manager_image[0] : null);

  const datenow = created_at ? new Date(created_at) : new Date();

  const fundData = {
    name: name || name_ar || name_en,
    description: description || description_ar || description_en,
    fund_manager_name: fund_manager_name || fund_manager_name_ar || fund_manager_name_en,
    currentprice,
    currency: currency || currency_ar || currency_en,  
    subscription_frequency: subscription_frequency || subscription_frequency_ar || subscription_frequency_en,
    redemption_frequency: redemption_frequency || redemption_frequency_ar || redemption_frequency_en,
    minimum_initial,
    Minimum_redemption_amount,
    subscription_fee,
    redemption_fee,
    type: type || type_ar || type_en, 
    annualfee,
    catid,
    fund_link,
    userid: user.id,
    status: user.role === "admin" ? 1 : 0,
    created_at: datenow,
  };

  if (imagePath) fundData.image = imagePath;
  if (fundManagerImagePath) fundData.fund_manager_image = fundManagerImagePath;

  Object.keys(fundData).forEach(key => (fundData[key] === undefined || fundData[key] === null) && delete fundData[key]);

  const translations = {
    ar: {
      name: name_ar || name,
      description: description_ar || description,
      fund_manager_name: fund_manager_name_ar || fund_manager_name,
      currency: currency_ar || currency,   
      subscription_frequency: subscription_frequency_ar || subscription_frequency,  
      redemption_frequency: redemption_frequency_ar || redemption_frequency,  
      type: type_ar || type  
    },
    en: {
      name: name_en || name,
      description: description_en || description,
      fund_manager_name: fund_manager_name_en || fund_manager_name,
      currency: currency_en || currency,  
      subscription_frequency: subscription_frequency_en || subscription_frequency,  
      redemption_frequency: redemption_frequency_en || redemption_frequency,  
      type: type_en || type  
    }
  };

  Object.keys(translations).forEach(lang => {
    Object.keys(translations[lang]).forEach(field => {
      if (!translations[lang][field]) {
        delete translations[lang][field];
      }
    });
    if (Object.keys(translations[lang]).length === 0) {
      delete translations[lang];
    }
  });

  return new Promise((resolve, reject) => {
    Fund.update(id, fundData, (err, results) => {
      if (err) return reject(err);
      
      if (Object.keys(translations).length > 0) {
        FundTranslation.bulkUpsert(id, translations, (err, transResults) => {
          if (err) {
            console.error('Translation update error:', err);
          }
          
          if (fundData.status === 0) {
            sendFundStatusUpdateEmail(
              user.name, 
              user.email, 
              name || name_ar, 
              datenow.toLocaleString(), 
              "Your fund update is waiting for admin approval.", 
              "A fund has been updated and is awaiting approval."
            );
          }
          resolve(results);
        });
      } else {
        if (fundData.status === 0) {
          sendFundStatusUpdateEmail(
            user.name, 
            user.email, 
            name || name_ar, 
            datenow.toLocaleString(), 
            "Your fund update is waiting for admin approval.", 
            "A fund has been updated and is awaiting approval."
          );
        }
        resolve(results);
      }
    });
  });
},

  getAllFunds: (page, lang = 'ar') => {
    const limit = 10;
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      Fund.findAll(limit, offset, lang, (err, data) => {
        if (err) return reject(err);
        resolve({ 
          funds_page_count: data.rows.length, 
          page_number: page, 
          total_funds: data.totalFunds, 
          funds_all: data.rows 
        });
      });
    });
  },

  getAllFundsNoPagination: (lang = 'ar') => {
    return new Promise((resolve, reject) => {
      Fund.findAllNoPagination(lang, (err, rows) => {
        if (err) return reject(err);
        resolve({ funds_all: rows, count: rows.length });
      });
    });
  },

  getPendingFunds: (page, lang = 'ar') => {
    const limit = 20;
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      Fund.findPending(limit, offset, lang, (err, rows) => {
        if (err) return reject(err);
        resolve({ 
          funds_page_count: rows.length, 
          page_number: page, 
          funds_all: rows 
        });
      });
    });
  },

  getApprovedFunds: (page, lang = 'ar') => {
    const limit = 20;
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      Fund.findApproved(limit, offset, lang, (err, rows) => {
        if (err) return reject(err);
        resolve({ 
          funds_page_count: rows.length, 
          page_number: page, 
          funds_all: rows 
        });
      });
    });
  },

  getFundDetails: (id, lang = 'ar') => {
    return new Promise((resolve, reject) => {
      Fund.findById(id, lang, (err, rows) => {
        if (err) return reject(err);
        const fundDetails = { ...rows[0] };
        resolve({ fundDetails });
      });
    });
  },

  updateFundPrice: (id, userId, newprice, date, status) => {
    return new Promise((resolve, reject) => {
      // الحصول على currentprice و status الحالي
      const getCurrentPriceQuery = "SELECT currentprice, newprice, status FROM funds WHERE id = ?";
      
      con.query(getCurrentPriceQuery, [id], (err, result) => {
        if (err) return reject(err);
        
        if (!result || result.length === 0) {
          return reject(new Error("Fund not found"));
        }
        
        const currentPrice = result[0].currentprice;
        const newPriceFromDB = result[0].newprice;
        const currentStatus = result[0].status;
        
        let updateCurrentPrice, updateNewPrice, updateStatus;
        
        // الحالة 1: Admin - السعر الجديد في الخانتين، Status = 1
        if (status === 1) {
          updateCurrentPrice = newprice;  // السعر الجديد
          updateNewPrice = newprice;      // السعر الجديد أيضاً
          updateStatus = 1;               // موافق
          console.log(`✅ Admin approval: New price ${newprice} set in both currentprice and newprice, Status = 1`);
        } 
        // الحالة 2: Manager أو Status=-1 أو Status=0
        else if (status === 0 || currentStatus === -1 || currentStatus === 0) {
          updateCurrentPrice = currentPrice;  // لا يتغير
          updateNewPrice = newprice;          // السعر الجديد
          updateStatus = 0;                   // في انتظار الموافقة
          console.log(`✅ Non-admin/Rejected/Pending: Updating newprice only to ${newprice}, currentprice remains ${currentPrice}, Status = 0`);
        }
        
        Fund.updatePriceWithStatus(id, updateCurrentPrice, updateNewPrice, updateStatus, (err, results) => {
          if (err) return reject(err);
          
          Fund.addPriceHistory({ 
            price: updateNewPrice, 
            userid: userId, 
            fundid: id,
            date: date 
          }, (err2, result2) => {
            if (err2) return reject(err2);
            resolve(results);
          });
        });
      });
    });
  },

// src/services/fund.service.js

updateFundStatus: (id, status, userId) => {
  return new Promise((resolve, reject) => {
    Fund.updateStatus(id, status, async (err, results) => {
      if (err) return reject(err);
      
      if (status === 1) {
        // ✅ Approved - تحديث currentprice بقيمة newprice بدون إضافة history
        Fund.findById(id, 'ar', async (err, fundResult) => {
          if (err) return reject(err);
          
          if (!fundResult || fundResult.length === 0) {
            console.error('❌ Fund not found');
            return resolve(results);
          }
          
          const { newprice, name, username, email, userid } = fundResult[0];
          
          // تحديث currentprice ليصبح newprice (بدون إضافة history)
          const updateQuery = "UPDATE funds SET currentprice = ? WHERE id = ?";
          con.query(updateQuery, [newprice, id], async (updateErr) => {
            if (updateErr) {
              console.error('❌ Failed to update currentprice:', updateErr);
            } else {
              console.log(`✅ Fund approved: currentprice updated to ${newprice}`);
            }
            
            // ✅ إرسال إيميل الموافقة
            if (email && !email.includes('example.com')) {
              try {
                await EmailService.sendFundApprovedEmail(
                  username,
                  email,
                  name,
                  new Date().toLocaleString('ar-EG', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })
                );
                console.log('✅ Approval email sent successfully to:', email);
              } catch (emailError) {
                console.error('❌ Failed to send approval email:', emailError);
              }
            } else {
              console.warn('⚠️ Invalid email, skipping email send:', email);
            }
            
            resolve(results);
          });
        });
      } else {
        // Status = 0 أو أي حاجة تانية
        resolve(results);
      }
    });
  });
},

declineFundStatus: (id, message) => {
  return new Promise((resolve, reject) => {
    // Step 1: Update status to 0 (declined)
    Fund.updateStatus(id, 0, (err, results) => {
      if(err) return reject(err);
      
      Fund.findFundForEmail(id, async (err, fundResult) => {
        if(err) return reject(err);
        
        if (!fundResult || fundResult.length === 0) {
          console.error('❌ Fund not found for email');
          return resolve(results);
        }
        
        const { fundname, username, email } = fundResult[0];
        
        // Step 2: Delete last history row for this fund
        Fund.deleteLastHistory(id, (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error('❌ Failed to delete last history:', deleteErr);
          } else {
            console.log('✅ Last history row deleted successfully');
          }
          
          // Step 3: Set status to -1 (rejected)
          Fund.updateStatus(id, -1, async (revertErr, revertResults) => {
            if (revertErr) {
              console.error('❌ Failed to set rejected status:', revertErr);
            } else {
              console.log('✅ Fund status set to rejected (-1)');
            }
            
            // Step 4: Send decline email
            if (email && !email.includes('example.com')) {
              try {
                await EmailService.sendFundDeclinedEmail(
                  username, 
                  email, 
                  fundname, 
                  new Date().toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  }), 
                  message
                );
                console.log('✅ Decline email sent successfully to:', email);
              } catch (emailError) {
                console.error('❌ Failed to send email:', emailError);
              }
            } else {
              console.warn('⚠️ Invalid email, skipping email send:', email);
            }
            
            resolve(revertResults || results);
          });
        });
      });
    });
  });
},

  deleteFund: (id) => {
    return new Promise((resolve, reject) => {
      Fund.delete(id, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getFundsForUser: (userId, page) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      Fund.findByUser(userId, limit, offset, (err, rows) => {
        if (err) return reject(err);
        resolve({ 
          funds_page_count: rows.length, 
          page_number: page, 
          funds_all: rows 
        });
      });
    });
  },

  reorderFunds: (orderedIds) => {
    return new Promise((resolve, reject) => {
      Fund.reorder(orderedIds, (err, result) => {
        if(err) return reject(err);
        resolve(result);
      });
    });
  },

  // ============ History Services ============

  /**
   * Get history with flexible filters
   * Supports: fundid, userid, date, startDate, endDate
   */
  getHistory: (page, filters = {}) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    return new Promise((resolve, reject) => {
      Fund.findHistory(filters, limit, offset, (err, data) => {
        if (err) return reject(err);
        resolve({
          success: 1,
          page_number: page,
          history_page_count: data.rows.length,
          total_history: data.total,
          history: data.rows
        });
      });
    });
  },

  /**
   * Get history for a specific fund
   */
  getHistoryByFund: (fundid, page) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    return new Promise((resolve, reject) => {
      Fund.findHistoryByFund(fundid, limit, offset, (err, data) => {
        if (err) return reject(err);
        resolve({
          success: 1,
          fundid,
          page_number: page,
          history_page_count: data.rows.length,
          total_history: data.total,
          history: data.rows
        });
      });
    });
  },

  /**
   * Get history for a specific user
   */
  getHistoryByUser: (userid, page) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    return new Promise((resolve, reject) => {
      Fund.findHistoryByUser(userid, limit, offset, (err, data) => {
        if (err) return reject(err);
        resolve({
          success: 1,
          userid,
          page_number: page,
          history_page_count: data.rows.length,
          total_history: data.total,
          history: data.rows
        });
      });
    });
  },

  /**
   * Get history by date or date range
   */
  getHistoryByDate: (startDate, endDate, page) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    // If only one date provided, use it for both start and end
    const start = startDate;
    const end = endDate || startDate;
    
    return new Promise((resolve, reject) => {
      Fund.findHistoryByDate(start, end, limit, offset, (err, data) => {
        if (err) return reject(err);
        resolve({
          success: 1,
          startDate: start,
          endDate: end,
          page_number: page,
          history_page_count: data.rows.length,
          total_history: data.total,
          history: data.rows
        });
      });
    });
  },

  /**
   * Get last 2 dates only for a specific fund
   */
  getLastTwoDates: (fundid) => {
    return new Promise((resolve, reject) => {
      Fund.findLastTwoDates(fundid, (err, data) => {
        if (err) return reject(err);
        resolve({
          success: 1,
          fundid: fundid,
          dates: data
        });
      });
    });
  },

  /**
   * Get all funds in a specific category
   * @param {number} categoryId - Category ID
   * @param {string} lang - Language (ar or en)
   */
  getFundsByCategory: (categoryId, lang = 'ar') => {
    return new Promise((resolve, reject) => {
      Fund.findByCategory(categoryId, lang, (err, data) => {
        if (err) return reject(err);
        resolve({
          success: 1,
          categoryId: categoryId,
          language: lang,
          count: data.length,
          funds: data
        });
      });
    });
  },

};

export default FundService;