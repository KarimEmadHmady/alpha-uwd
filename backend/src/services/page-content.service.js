import { PageContentModel } from "../models/page-content.model.js";

export const PageContentService = {
  /**
   * Get full structured content for a page.
   * @param {string} page - Page name (e.g., 'home', 'about')
   * @param {string} lang - Optional language code ('ar' or 'en'). If provided, filters content to return only that language.
   * @returns {object|null} Page content with optional language filtering
   */
  async getPageContent(page, lang = null) {
    const result = await PageContentModel.getByPage(page);
    
    if (!result) {
      return null;
    }

    // Debug logging
    console.log('PageContentService.getPageContent:', {
      page,
      lang,
      hasContent: !!result.content,
      willFilter: lang && (lang === 'ar' || lang === 'en'),
    });

    // If lang is specified, filter content to return only that language
    if (lang && (lang === 'ar' || lang === 'en')) {
      const filteredContent = this._filterContentByLanguage(result.content, lang);
      console.log('Filtered content sample:', JSON.stringify(filteredContent).substring(0, 200));
      return {
        ...result,
        content: filteredContent,
      };
    }

    // Return full content (all languages) if no lang specified
    return result;
  },

  /**
   * Filter content structure to return only texts in the specified language.
   * Transforms: { hero: { title: { ar: "...", en: "..." } } }
   * To: { hero: { title: "..." } } (only the requested language)
   */
_filterContentByLanguage(content, lang) {
  if (!content || typeof content !== 'object') {
    return content;
  }

  // ✅ لو array، اعمل map على كل عنصر
  if (Array.isArray(content)) {
    return content.map(item => this._filterContentByLanguage(item, lang));
  }

  const filtered = {};

  for (const [sectionKey, sectionValue] of Object.entries(content)) {
    if (!sectionValue || typeof sectionValue !== 'object') {
      filtered[sectionKey] = sectionValue;
      continue;
    }

    // ✅ لو الـ value نفسه array
    if (Array.isArray(sectionValue)) {
      filtered[sectionKey] = sectionValue.map(item => 
        this._filterContentByLanguage(item, lang)
      );
      continue;
    }

    // باقي الكود كما هو...
    const filteredSection = {};
    for (const [fieldKey, fieldValue] of Object.entries(sectionValue)) {
      if (fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
        const keys = Object.keys(fieldValue);
        const isMultilingualField = keys.includes('ar') || keys.includes('en');
        
        if (isMultilingualField) {
          let textValue = fieldValue[lang] ?? fieldValue['ar'] ?? fieldValue['en'] ?? '';
          filteredSection[fieldKey] = textValue;
        } else {
          filteredSection[fieldKey] = this._filterContentByLanguage(fieldValue, lang);
        }
      } else {
        filteredSection[fieldKey] = fieldValue;
      }
    }
    filtered[sectionKey] = filteredSection;
  }

  return filtered;
},

  /**
   * Update (or create) content for a page.
   * This is an "update-only" API from the client's perspective:
   * the key (page) is fixed in the URL, and we always upsert.
   */
  async updatePageContent(page, content) {
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      const error = new Error("Content must be a JSON object");
      error.statusCode = 400;
      throw error;
    }

    await PageContentModel.upsertByPage(page, content);
    return await PageContentModel.getByPage(page);
  },
};


