import { PageContentService } from "../services/page-content.service.js";
import path from "path";

/**
 * Helper: Extract language from query parameter or Accept-Language header.
 * Priority: Query Parameter > Header > null (returns all languages)
 * 
 * @param {object} req - Express request object
 * @returns {string|null} Language code ('ar' or 'en') or null for all languages
 */
const getLanguageFromRequest = (req) => {
  // 1. Check query parameter first (highest priority)
  const queryLang = req.query.lang;

  if (queryLang === 'all') return null;

  if (queryLang && (queryLang === 'ar' || queryLang === 'en')) {
    return queryLang;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    // Parse Accept-Language header (e.g., "ar,en;q=0.9" or "ar" or "en-US,en;q=0.9")
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        // Extract language code (e.g., "ar" from "ar" or "ar;q=0.8" or "ar-SA")
        const langCode = lang.split(';')[0].trim().split('-')[0].toLowerCase();
        return langCode;
      });

    // Check if any supported language is in the header
    if (languages.includes('ar')) {
      return 'ar';
    }
    if (languages.includes('en')) {
      return 'en';
    }
  }

  // 3. No language specified - return null (all languages)
  return null;
};

/**
 * GET /alpha/api/page-content/:page?lang=ar|en
 * Public endpoint for Web / Flutter apps to read structured page content.
 * 
 * Language Detection Priority:
 *   1. Query Parameter: ?lang=ar or ?lang=en (highest priority)
 *   2. Accept-Language Header: Accept-Language: ar or Accept-Language: en
 *   3. None: Returns all languages (full multilingual structure)
 * 
 * Query Parameters:
 *   - lang (optional): 'ar' or 'en' - If provided, returns content filtered to that language only.
 * 
 * Headers:
 *   - Accept-Language (optional): 'ar' or 'en' - Used if query parameter is not provided.
 * 
 * Examples:
 *   GET /alpha/api/page-content/home                    → Returns all languages
 *   GET /alpha/api/page-content/home?lang=ar           → Returns Arabic only
 *   GET /alpha/api/page-content/home?lang=en           → Returns English only
 *   GET /alpha/api/page-content/home (with Accept-Language: ar header) → Returns Arabic only
 */
export const getPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    
    // Get language from query parameter or header
    const lang = getLanguageFromRequest(req);

    // Validate lang if provided (shouldn't happen, but safety check)
    if (lang && lang !== 'ar' && lang !== 'en') {
      return res.status(400).json({
        success: 0,
        message: "Invalid language parameter. Use 'ar' or 'en'.",
      });
    }

    const result = await PageContentService.getPageContent(page, lang);

    if (!result) {
      return res.status(404).json({
        success: 0,
        message: "Page content not found",
      });
    }

    // Build response
    const response = {
      success: 1,
      page: result.page,
      content: result.content,
      updated_at: result.updated_at,
    };

    // Include lang in response if filtered
    if (lang) {
      response.lang = lang;
      response.source = req.query.lang ? 'query' : 'header'; // Indicate source
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching page content:", err);
    res.status(500).json({
      success: 0,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * PUT /alpha/api/page-content/:page
 * Admin-only endpoint to update page content.
 * Supports optional image upload via form-data.
 * Body (multipart/form-data):
 *   - content: JSON string of page content
 *   - image: optional image file (single) or images: multiple image files
 * 
 * Images uploaded will have their paths returned in the response
 * The content JSON can reference image paths like: "uploads/Contant-page/filename.jpg"
 */
export const updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    let { content } = req.body;

    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch (err) {
        return res.status(400).json({ success: 0, message: "Content must be valid JSON" });
      }
    }

    // Collect uploaded files
    const uploadedImages = [];
    const files = req.files || (req.file ? [req.file] : []);
    
    files.forEach((file) => {
      uploadedImages.push({
        originalName: file.originalname,
        fieldName: file.fieldname, 
        filename: file.filename,
        path: `uploads/Contant-page/${file.filename}`,
        size: file.size,
      });
    });

    // ✅ استبدل الـ image paths في الـ content بالـ paths الفعلية
if (uploadedImages.length > 0) {
  const replaceImagePaths = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => replaceImagePaths(item));
      return;
    }
    
    for (const [fieldKey, fieldValue] of Object.entries(obj)) {
      if (typeof fieldValue === 'string') {
        const matchedImage = uploadedImages.find(
          (img) => img.originalName === fieldValue || img.filename === fieldValue
        );
        if (matchedImage) {
          obj[fieldKey] = matchedImage.path;
        }
      } else if (typeof fieldValue === 'object') {
        replaceImagePaths(fieldValue);
      }
    }
  };

  replaceImagePaths(content);
}

    const updated = await PageContentService.updatePageContent(page, content);

    return res.status(200).json({
      success: 1,
      message: "Page content updated successfully",
      page: updated.page,
      content: updated.content,
      updated_at: updated.updated_at,
      ...(uploadedImages.length > 0 && { uploadedImages }),
    });
  } catch (err) {
    console.error("Error updating page content:", err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: 0, message: err.message });
    }
    res.status(500).json({ success: 0, message: "Internal server error", error: err.message });
  }
};
