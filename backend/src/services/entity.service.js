// src/services/entity.service.js
import Entity from "../models/entity.model.js";
import sharp from "sharp";

const processImage = async (file) => {
  if (!file) return null;
  const imageFilename = `entity-${Date.now()}.jpeg`;
  await sharp(file.buffer)
    .resize(400, 200, { fit: 'cover' })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/entities/${imageFilename}`);
    const imageUrl = `http://revamp.alpha-odin.com/alpha/uploads/entities/${imageFilename}`;

  return imageUrl;
};

const EntityService = {

  createEntity: async (data, file) => {
    const imagePath = await processImage(file);
    
    const entityData = {
      fund_id: data.fund_id,
      entname: data.entname,
      link: data.link || null,
      imageent: imagePath,
      display_order: data.display_order || 0
    };

    return new Promise((resolve, reject) => {
      Entity.create(entityData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  bulkCreateEntities: async (fundId, entities, files) => {
    const entitiesData = await Promise.all(
      entities.map(async (entity, index) => {
        const file = files && files[index] ? files[index] : null;
        const imagePath = await processImage(file);
        return {
          fund_id: fundId,
          entname: entity.entname,
          link: entity.link || null,
          imageent: imagePath,
          display_order: entity.display_order || index + 1
        };
      })
    );

    return new Promise((resolve, reject) => {
      Entity.bulkCreate(entitiesData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  updateEntity: async (id, data, file) => {
    const imagePath = await processImage(file);
    
    const entityData = {
      entname: data.entname,
      link: data.link,
      display_order: data.display_order
    };

    if (imagePath) entityData.imageent = imagePath;

    Object.keys(entityData).forEach(key => 
      (entityData[key] === undefined || entityData[key] === null) && delete entityData[key]
    );

    return new Promise((resolve, reject) => {
      Entity.update(id, entityData, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  deleteEntity: (id) => {
    return new Promise((resolve, reject) => {
      Entity.delete(id, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },


  getEntitiesByFundId: (fundId) => {
    return new Promise((resolve, reject) => {
      Entity.findByFundId(fundId, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },


  getEntityById: (id) => {
    return new Promise((resolve, reject) => {
      Entity.findById(id, (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  },


  getAllEntities: () => {
    return new Promise((resolve, reject) => {
      Entity.findAll((err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },


  reorderEntities: (orderedIds) => {
    return new Promise((resolve, reject) => {
      Entity.reorder(orderedIds, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

export default EntityService;