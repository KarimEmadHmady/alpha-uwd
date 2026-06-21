// src/services/category.service.js
import { CategoryModel } from "../models/category.model.js";
import CategoryTranslation from "../models/category-translation.model.js";

export const CategoryService = {
  /**
   * Add a new category with translations
   * @param {object} data - Basic category data
   * @param {object} translations - Translations { ar: { name: '...' }, en: { name: '...' } }
   */
  addCategory: async (data, translations = null) => {
    // Insert basic data
    const result = await CategoryModel.create(data);
    const categoryId = result.insertId;

    // Add translations if provided
    if (translations && Object.keys(translations).length > 0) {
      return new Promise((resolve, reject) => {
        CategoryTranslation.bulkUpsert(categoryId, translations, (err, transResults) => {
          if (err) {
            console.error('Translation insert error:', err);
            // Do not reject the operation, just log the error
          }
          resolve({ ...result, categoryId });
        });
      });
    }

    return { ...result, categoryId };
  },

  /**
   * Update a category with translations
   * @param {number} id - Category ID
   * @param {object} data - Basic category data
   * @param {object} translations - Translations
   */
  updateCategory: async (id, data, translations = null) => {
    // Update basic data
    const result = await CategoryModel.update(id, data);

    // Update translations if provided
    if (translations && Object.keys(translations).length > 0) {
      return new Promise((resolve, reject) => {
        CategoryTranslation.bulkUpsert(id, translations, (err, transResults) => {
          if (err) {
            console.error('Translation update error:', err);
          }
          resolve(result);
        });
      });
    }

    return result;
  },

  /**
   * Delete a category
   * @param {number} id - Category ID
   */
  deleteCategory: async (id) => {
    return await CategoryModel.delete(id);
  },

  /**
   * Get all categories in a specific language
   * @param {string} lang - Desired language (ar or en)
   */
  getAllCategories: async (lang = 'ar') => {
    return await CategoryModel.getAll(lang);
  },

  /**
   * Get a single category in a specific language
   * @param {number} id - Category ID
   * @param {string} lang - Desired language
   */
  getCategoryById: async (id, lang = 'ar') => {
    return await CategoryModel.getById(id, lang);
  },

  /**
   * Get all categories with all translations (for admin panel)
   */
  getAllCategoriesWithTranslations: async () => {
    return await CategoryModel.getAllWithTranslations();
  }
};
