'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

// Footer page definition - Footer content only
const FOOTER_PAGE_DEFINITION = {
  pageKey: 'footer',
  sections: {
    footer: {
      label: 'Footer Section',
      fields: {
        description: 'Description',
        importantLinksTitle: 'Important Links Title',
        homeLinkText: 'Home Link Text',
        aboutLinkText: 'About Link Text',
        servicesLinkText: 'Services Link Text',
        reportsLinkText: 'Reports Link Text',
        contactLinkText: 'Contact Link Text',
        copyrightText: 'Copyright Text',
        aboutUsTitle: 'About Us Column Title',
        helloLinkText: 'Hello Link Text',
        corporateServicesLinkText: 'Corporate Services Link Text',
        institutionalInvestorsLinkText: 'Institutional Investors Link Text',
        ourTeamLinkText: 'Our Team Link Text',
        contactUsTitle: 'Contact Us Column Title',
        phoneNumber: 'Phone Number',
        emailAddress: 'Email Address',
        contactFormLinkText: 'Contact Form Link Text',
        developedByText: 'Developed By Text',
        developedByUrl: 'Developed By URL',
      },
      imageFields: {
        logoImage: 'Logo Image',
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
  'logoImage',
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

const FooterPageEditor = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState('footer');
  const [activeLang, setActiveLang] = useState('ar');
  const [images, setImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  // Local content state matches the JSON stored in the backend
  const [content, setContent] = useState({});

  // Load existing content for "footer" page
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pageContentService.getPageContent(FOOTER_PAGE_DEFINITION.pageKey).catch(() => null);
        
        if (response && response.content) {
          setContent(ensureContentStructure(response.content));
        } else {
          // Initialize empty structure if not found
          setContent({});
        }
      } catch (err) {
        console.error('Failed to load footer page content:', err);
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
        FOOTER_PAGE_DEFINITION.pageKey, content, token, images
      );
      
      // حدّث الـ content بالـ paths الفعلية من الـ response
      if (result.content) setContent(ensureContentStructure(result.content));
      setImages({});
      setImagePreviews({});
      setSuccess('Footer content saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const currentSection = FOOTER_PAGE_DEFINITION.sections[activeSection];
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
        <h1 className="text-2xl font-bold mb-2">Footer Page Content</h1>
        <p className="text-gray-500 text-sm">
          Manage dynamic footer content for the website. Changes are served via API and used by Web & Flutter.
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
          <button
            type="button"
            onClick={() => setActiveSection('footer')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${
              activeSection === 'footer'
                ? 'border-[#00437a] text-[#00437a] bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-[#00437a] hover:bg-gray-50'
            }`}
          >
            Footer
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-2 mb-4">
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
          {/* Text Fields - موجودة */}
          {Object.entries(FOOTER_PAGE_DEFINITION.sections.footer.fields).map(([fieldKey, label]) => {
            const value = content?.footer?.[fieldKey]?.[activeLang] || '';
            return (
              <div key={fieldKey}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFieldChange('footer', fieldKey, activeLang, e.target.value)}
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
                const previewKey = `footer.${fieldKey}`;
                const existingPath = content?.footer?.[fieldKey];
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
                      onChange={(e) => handleImageChange('footer', fieldKey, e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#00437a] file:text-white hover:file:bg-[#005a9c]"
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
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-full bg-[#00437a] hover:bg-[#003060] text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterPageEditor;