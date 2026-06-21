'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

// تعريف صفحة Fund Hero - كل السيكشنز من صفحة Fund Details
const FUND_HERO_PAGE_DEFINITION = {
  pageKey: 'fundHero',
  sections: {
    hero: {
      label: 'Hero Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Title',
        subtitle: 'Subtitle',
        ctaText: 'CTA Button Text',
        ctaLink: 'CTA Link',
        totalUsersLabel: 'Total Users Label',
        trustLabel: 'Trust Label',
      },
      imageFields: {
        backgroundImage: 'Background Image',
        heroImage: 'Hero Image',
      },
    },
  },
};

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

// الـ image fields في كل section
const IMAGE_FIELDS = new Set([
  'backgroundImage',
  'heroImage',
]);

const ensureContentStructure = (content) => {
  if (!content || typeof content !== 'object') return {};
  
  const result = {};
  
  for (const [sectionKey, sectionValue] of Object.entries(content)) {
    if (!sectionValue || typeof sectionValue !== 'object') {
      result[sectionKey] = sectionValue;
      continue;
    }
    
    result[sectionKey] = {};
    for (const [fieldKey, fieldValue] of Object.entries(sectionValue)) {
      // Image fields — خليها string كما هي ✅
      if (IMAGE_FIELDS.has(fieldKey)) {
        result[sectionKey][fieldKey] = typeof fieldValue === 'object'
          ? (fieldValue.ar || fieldValue.en || '')  // fallback لو اتحفظت غلط
          : String(fieldValue || '');
        continue;
      }
      
      // Multilingual fields — خليها كما هي ✅
      if (fieldValue && typeof fieldValue === 'object' && (fieldValue.ar !== undefined || fieldValue.en !== undefined)) {
        result[sectionKey][fieldKey] = fieldValue;
      } else {
        // حوّل string لـ multilingual
        result[sectionKey][fieldKey] = { ar: String(fieldValue || ''), en: String(fieldValue || '') };
      }
    }
  }
  
  return result;
};

const FundHeroContentEditor = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeLang, setActiveLang] = useState('ar');
  const [images, setImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  // Local content state matches the JSON stored in the backend
  const [content, setContent] = useState({});

  // Load existing content for "fundHero" page
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pageContentService.getPageContent(FUND_HERO_PAGE_DEFINITION.pageKey).catch(() => null);
        
        if (response && response.content) {
          setContent(ensureContentStructure(response.content));
        } else {
          // Initialize empty structure if not found
          setContent({});
        }
      } catch (err) {
        console.error('Failed to load fund hero page content:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleImageChange = (sectionKey, fieldKey, file) => {
    if (!file) return;
    
    const key = `${sectionKey}.${fieldKey}`;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviews(prev => ({ ...prev, [key]: e.target.result }));
    };
    reader.readAsDataURL(file);
    
    setImages(prev => ({ ...prev, [key]: file }));
    
    // ✅ حط اسم الملف الأصلي عشان الـ backend يعرف يعمل match
    setContent(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [fieldKey]: file.name,
      },
    }));
  };

  const handleFieldChange = (sectionKey, fieldKey, lang, value) => {
    setContent((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [fieldKey]: {
          ...((prev[sectionKey] || {})[fieldKey] || {}),
          [lang]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!token) { setError('You must be logged in as admin to save.'); return; }
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const result = await pageContentService.updatePageContent(
        FUND_HERO_PAGE_DEFINITION.pageKey, content, token, images
      );
      
      // حدّث الـ content بالـ paths الفعلية من الـ response
      if (result.content) setContent(ensureContentStructure(result.content));
      setImages({});
      setImagePreviews({});
      setSuccess('Fund hero content saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]" />
        </div>
      </div>
    );
  }

  const activeSection = 'hero';

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Fund Hero Section Content</h1>
        <p className="text-gray-500 text-sm">
          Manage dynamic text content for the fund details hero section. Changes are served via API and used by Web & Flutter.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Language Tabs */}
        <div className="flex gap-2 mb-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                activeLang === lang.code
                  ? 'bg-[#00437a] text-white border-[#00437a]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Fields for active section + language */}
        <div className="space-y-4">
          {/* Text Fields */}
          {Object.entries(FUND_HERO_PAGE_DEFINITION.sections[activeSection].fields).map(([fieldKey, label]) => {
            const value =
              content?.[activeSection]?.[fieldKey]?.[activeLang] || '';

            return (
              <div key={fieldKey}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} ({activeLang.toUpperCase()})
                </label>
                {fieldKey.includes('description') || fieldKey.includes('Description') ? (
                  <textarea
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(activeSection, fieldKey, activeLang, e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] focus:border-[#00437a] text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(activeSection, fieldKey, activeLang, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] focus:border-[#00437a] text-sm"
                  />
                )}
              </div>
            );
          })}

          {/* Image Fields */}
          {Object.keys(FUND_HERO_PAGE_DEFINITION.sections[activeSection].imageFields || {}).length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Images</h3>
              {Object.entries(FUND_HERO_PAGE_DEFINITION.sections[activeSection].imageFields).map(([fieldKey, label]) => {
                const previewKey = `${activeSection}.${fieldKey}`;
                const existingPath = content?.[activeSection]?.[fieldKey];
                const preview = imagePreviews[previewKey];

                return (
                  <div key={fieldKey} className="border-b pb-4 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(activeSection, fieldKey, e.target.files?.[0] || null)
                      }
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00437a] file:text-white hover:file:bg-[#003060]"
                    />
                    {(preview || existingPath) && (
                      <div className="mt-2">
                        <img
                          src={preview || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/uploads/${existingPath}`}
                          alt={label}
                          className="max-w-xs h-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#00437a] text-white text-sm font-semibold shadow hover:bg-[#005a9c] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundHeroContentEditor;
