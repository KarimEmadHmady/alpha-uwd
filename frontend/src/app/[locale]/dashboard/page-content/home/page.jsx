'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

// Simple definition of the "home" page structure for the dashboard form.
// Backend stays schema-less (stores any JSON you send).
const HOME_PAGE_DEFINITION = {
  pageKey: 'home',
  sections: {
    hero: {
      label: 'Hero Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Main Title',
        subtitle: 'Subtitle',
        buttonText: 'Button Text',
        totalUsersLabel: 'Total Users Label',
        activeUsersLabel: 'Active Users Label',
        activeUsersSubLabel: 'Active Users Sub Label',
        satisfiedClientsLabel: 'Satisfied Clients Label',
        reviewsLabel: 'Reviews Label',
      },
      imageFields: {
        backgroundImage: 'Background Image',
      },
    },
    trustedBy: {
      label: 'Trusted By Section',
      fields: {
        trustedByText: 'Trusted By Text',
      },
      imageFields: {
        partner1Image: 'Partner 1 Image',
        partner2Image: 'Partner 2 Image',
        partner3Image: 'Partner 3 Image',
        partner4Image: 'Partner 4 Image',
        partner5Image: 'Partner 5 Image',
        partner6Image: 'Partner 6 Image',
      },
    },
    about: {
      label: 'About Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Title',
        description: 'Description',
        bullet1: 'Bullet 1',
        bullet2: 'Bullet 2',
        bullet3: 'Bullet 3',
        stat1Value: 'Stat 1 Value',
        stat1Label: 'Stat 1 Label',
        stat2Value: 'Stat 2 Value',
        stat2Label: 'Stat 2 Label',
        stat3Value: 'Stat 3 Value',
        stat3Label: 'Stat 3 Label',
      },
      imageFields: {
        sectionImage: 'Section Image',
      },
    },
    services: {
      label: 'Services Section',
      fields: {
        badgeText: 'Badge Text',
        subtitle: 'Subtitle',
        service1Title: 'Service 1 Title',
        service1Desc: 'Service 1 Description',
        service2Title: 'Service 2 Title',
        service2Desc: 'Service 2 Description',
        service3Title: 'Service 3 Title',
        service3Desc: 'Service 3 Description',
        service4Title: 'Service 4 Title',
        service4Desc: 'Service 4 Description',
        service5Title: 'Service 5 Title',
        service5Desc: 'Service 5 Description',
      },
      imageFields: {
        service1Image: 'Service 1 Image',
        service2Image: 'Service 2 Image',
        service3Image: 'Service 3 Image',
        service4Image: 'Service 4 Image',
        service5Image: 'Service 5 Image',
      },
    },
    cta: {
      label: 'CTA Section',
      fields: {
        title: 'Title',
        subtitle: 'Subtitle',
        buttonText: 'Button Text',
      },
      imageFields: {
        backgroundImage: 'Background Image',
        leftDecorationImage: 'Left Decoration Image',
        rightImage: 'Right Image',
      },
    },
    faq: {
      label: 'FAQ Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Title',
        subtitle: 'Subtitle',
        buttonText: 'Button Text',
        faq1Question: 'FAQ 1 Question',
        faq1Answer: 'FAQ 1 Answer',
        faq2Question: 'FAQ 2 Question',
        faq2Answer: 'FAQ 2 Answer',
        faq3Question: 'FAQ 3 Question',
        faq3Answer: 'FAQ 3 Answer',
        faq4Question: 'FAQ 4 Question',
        faq4Answer: 'FAQ 4 Answer',
      },
    },


    blogs: {
      label: 'Blogs Section',
      fields: {
        badgeText: 'Badge Text',
        blog1Title: 'Blog 1 Title',
        blog1Date: 'Blog 1 Date',
        blog2Title: 'Blog 2 Title',
        blog2Date: 'Blog 2 Date',
        blog3Title: 'Blog 3 Title',
        blog3Date: 'Blog 3 Date',
        readMoreText: 'Read More',
      },
      imageFields: {
        blog1Image: 'Blog 1 Image',
        blog2Image: 'Blog 2 Image',
        blog3Image: 'Blog 3 Image',
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
  'sectionImage',
  'blog1Image',
  'blog2Image',
  'blog3Image',
  'leftDecorationImage',
  'rightImage',
  'service1Image',
  'service2Image',
  'service3Image',
  'service4Image',
  'service5Image',
  'partner1Image',
  'partner2Image',
  'partner3Image',
  'partner4Image',
  'partner5Image',
  'partner6Image',
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
const HomePageContentEditor = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeLang, setActiveLang] = useState('ar');
  const [images, setImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  // Local content state matches the JSON stored in the backend
  const [content, setContent] = useState({});

  // Load existing content for "home" page
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pageContentService.getPageContent(HOME_PAGE_DEFINITION.pageKey).catch(() => null);

        if (response && response.content) {
          setContent(ensureContentStructure(response.content));
        } else {
          // Initialize empty structure if not found
          setContent({});
        }
      } catch (err) {
        console.error('Failed to load home page content:', err);
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
        HOME_PAGE_DEFINITION.pageKey, content, token, images
      );
      // حدّث الـ content بالـ paths الفعلية من الـ response
      if (result.content) setContent(ensureContentStructure(result.content));
      setImages({});
      setImagePreviews({});
      setSuccess('Page content saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const currentSection = HOME_PAGE_DEFINITION.sections[activeSection];
  const imageFields = currentSection.imageFields || {};

  if (loading) {
    return (
      <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Home Page Content</h1>
        <p className="text-gray-500 text-sm">
          Manage dynamic text content for the public home page. Changes are served via API and used by Web & Flutter.
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
        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 border-b mb-4">
          {Object.entries(HOME_PAGE_DEFINITION.sections).map(([key, section]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${activeSection === key
                  ? 'border-[#00437a] text-[#00437a] bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-[#00437a] hover:bg-gray-50'
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Language Tabs */}
        <div className="flex gap-2 mb-4">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLang(lang.code)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${activeLang === lang.code
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
          {/* Text Fields - موجودة */}
          {Object.entries(HOME_PAGE_DEFINITION.sections[activeSection].fields).map(([fieldKey, label]) => {
            const value = content?.[activeSection]?.[fieldKey]?.[activeLang] || '';
            return (
              <div key={fieldKey}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFieldChange(activeSection, fieldKey, activeLang, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] text-sm"
                />
              </div>
            );
          })}

          {/* Image Fields - جديد */}
          {Object.keys(imageFields).length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Images</h3>
              {Object.entries(imageFields).map(([fieldKey, label]) => {
                const previewKey = `${activeSection}.${fieldKey}`;
                const existingPath = content?.[activeSection]?.[fieldKey];
                const preview = imagePreviews[previewKey];

                return (
                  <div key={fieldKey} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>

                    {/* Preview */}
                    {(preview || existingPath) && (
                      <img
                        src={preview || `${BASE_URL}/${existingPath}`}
                        alt={label}
                        className="w-40 h-24 object-contain rounded-lg mb-2 border"
                      />
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleImageChange(activeSection, fieldKey, e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#00437a] file:text-white hover:file:bg-[#005a9c]"
                    />

                    {existingPath && !preview && (
                      <p className="text-xs text-gray-400 mt-1">{existingPath}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save button */}
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

export default HomePageContentEditor;


