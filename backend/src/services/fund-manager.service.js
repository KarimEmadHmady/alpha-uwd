// src/services/fund-manager.service.js
import FundManager from "../models/fund-manager.model.js";
import sharp from "sharp";

const processImage = async (file) => {
  if (!file) return null;
  const imageFilename = `manager-${Date.now()}.jpeg`;
  await sharp(file.buffer)
    .resize(300, 300, { fit: 'cover' })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/managers/${imageFilename}`);
     const imageUrl = `http://revamp.alpha-odin.com/alpha/uploads/managers/${imageFilename}`;

  return imageUrl;
};

const FundManagerService = {

  createManager: async (data, file) => {
    const imagePath = await processImage(file);
    
    const managerData = {
      fund_id: data.fund_id,
      name: data.name,
      name_arabic: data.name_arabic || null,
      image: imagePath,
      display_order: data.display_order || 0
    };

    return new Promise((resolve, reject) => {
      FundManager.create(managerData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  bulkCreateManagers: async (fundId, managers, files) => {
    const managersData = await Promise.all(
      managers.map(async (manager, index) => {
        const file = files && files[index] ? files[index] : null;
        const imagePath = await processImage(file);
        return {
          fund_id: fundId,
          name: manager.name,
          name_arabic: manager.name_arabic || null,
          image: imagePath,
          display_order: manager.display_order || index + 1
        };
      })
    );

    return new Promise((resolve, reject) => {
      FundManager.bulkCreate(managersData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  updateManager: async (id, data, file) => {
    const imagePath = await processImage(file);
    
    const managerData = {
      name: data.name,
      name_arabic: data.name_arabic,
      display_order: data.display_order
    };

    if (imagePath) managerData.image = imagePath;

    Object.keys(managerData).forEach(key => 
      (managerData[key] === undefined || managerData[key] === null) && delete managerData[key]
    );

    return new Promise((resolve, reject) => {
      FundManager.update(id, managerData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  deleteManager: (id) => {
    return new Promise((resolve, reject) => {
      FundManager.delete(id, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  getManagersByFundId: (fundId) => {
    return new Promise((resolve, reject) => {
      FundManager.findByFundId(fundId, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },


  getManagerById: (id) => {
    return new Promise((resolve, reject) => {
      FundManager.findById(id, (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  },


  reorderManagers: (orderedIds) => {
    return new Promise((resolve, reject) => {
      FundManager.reorder(orderedIds, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

export default FundManagerService;