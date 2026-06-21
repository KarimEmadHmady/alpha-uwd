// src/controllers/category.controller.js
import { CategoryService } from "../services/category.service.js";

/**
Helper: Extracting the language from the request */
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



/**
 * Add a new category with translations
 * POST /api/categories
 * Body: {
 *   name: "...",
 *   translations: {
 *     ar: { name: "صناديق الأسهم" },
 *     en: { name: "Equity Funds" }
 *   }
 * }
 */

export const addCategory = async (req, res) => {
  try {
    const { name, name_ar, name_en, name_arabic, translations } = req.body;

// Basic category data
    const categoryData = {
      name: name || name_en || name_ar || name_arabic, // backward compatibility
    };

// Prepare translations
    let categoryTranslations = translations;
    
// If no translations are provided, we generate them from the original data
    if (!categoryTranslations && (name_ar || name_arabic || name_en)) {
      categoryTranslations = {};
      
      if (name_ar || name_arabic) {
        categoryTranslations.ar = { name: name_ar || name_arabic };
      }
      
      if (name_en || name) {
        categoryTranslations.en = { name: name_en || name };
      }
    }

    const result = await CategoryService.addCategory(categoryData, categoryTranslations);

    res.status(201).json({
      success: 1,
      message: "Category added successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: 0, 
      message: "Internal server error",
      error: err.message 
    });
  }
};

/**
* Update a category with translations
 * PUT /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, name_ar, name_en,  translations } = req.body;

// Base data
    const categoryData = {};
    if (name !== undefined) categoryData.name = name;

// Prepare translations
    let categoryTranslations = translations;
    
    // backward compatibility
    if (!categoryTranslations && (name_ar || name_en)) {
      categoryTranslations = {};
      if (name_ar) categoryTranslations.ar = { name: name_ar };
      if (name_en) categoryTranslations.en = { name: name_en };
    }

    await CategoryService.updateCategory(id, categoryData, categoryTranslations);

    res.status(200).json({ 
      success: 1, 
      message: "Category updated successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: 0, 
      message: "Internal server error",
      error: err.message 
    });
  }
};

/**
 DELETE categories
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.deleteCategory(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: 0, 
        message: "Category not found" 
      });
    }

    res.status(200).json({ 
      success: 1, 
      message: "Category deleted successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: 0, 
      message: "Internal server error",
      error: err.message 
    });
  }
};

/**
 * GET /api/categories?lang=en
 */
export const getAllCategories = async (req, res) => {
  try {
    const lang = getLanguage(req);
    const result = await CategoryService.getAllCategories(lang);

    res.status(200).json({ 
      success: 1, 
      data: result,
      count: result.length 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: 0, 
      message: "Internal server error",
      error: err.message 
    });
  }
};

/**
 * GET /api/categories/:id?lang=en
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = getLanguage(req);
    const result = await CategoryService.getCategoryById(id, lang);

    if (!result) {
      return res.status(404).json({ 
        success: 0, 
        message: "Category not found" 
      });
    }

    res.status(200).json({ 
      success: 1, 
      data: result 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: 0, 
      message: "Internal server error",
      error: err.message 
    });
  }
};

/**
 * GET /api/categories/admin/all
 */
export const getAllCategoriesWithTranslations = async (req, res) => {
  try {
    const result = await CategoryService.getAllCategoriesWithTranslations();

    res.status(200).json({ 
      success: 1, 
      data: result,
      count: result.length 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: 0, 
      message: "Internal server error",
      error: err.message 
    });
  }
};