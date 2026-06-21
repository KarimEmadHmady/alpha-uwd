'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

const FUNDS_MANAGEMENT_PAGE_DEFINITION = {
  pageKey: 'fundsmanagement',
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
    serviceDescription: {
      label: 'Service Description Section',
      fields: {
        title: 'Title',
        description: 'Description',
        highlight1: 'Highlight 1',
        highlight2: 'Highlight 2',
        highlight3: 'Highlight 3',
        otherServicesTitle: 'Other Services Title',
        otherService1Label: 'Other Service 1 Label',
        otherService1Link: 'Other Service 1 Link',
        otherService2Label: 'Other Service 2 Label',
        otherService2Link: 'Other Service 2 Link',
        otherService3Label: 'Other Service 3 Label',
        otherService3Link: 'Other Service 3 Link',
        otherService4Label: 'Other Service 4 Label',
        otherService4Link: 'Other Service 4 Link',
      },
      imageFields: {},
    },
  },
};

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

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
      // Image fields — خليها string كما هي 
      if (IMAGE_FIELDS.has(fieldKey)) {
        result[sectionKey][fieldKey] = typeof fieldValue === 'object'
          ? (fieldValue.ar || fieldValue.en || '')  // fallback لو اتحفظت غلط
          : String(fieldValue || '');
        continue;
      }
      
      // Multilingual fields — خليها كما هي 
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

const FundsManagementPageContentEditor = () => {
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

  // Load existing content for "fundsmanagement" page
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pageContentService.getPageContent(FUNDS_MANAGEMENT_PAGE_DEFINITION.pageKey).catch(() => null);
        
        if (response && response.content) {
          setContent(ensureContentStructure(response.content));
        } else {
          // Initialize empty structure if not found
          setContent({});
        }
      } catch (err) {
        console.error('Failed to load funds management page content:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Handle field change
  const handleFieldChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...(prev[section]?.[field] || {}),
          [activeLang]: value,
        },
      },
    }));
  };

  // Handle image change
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

  // Save content
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Prepare images for upload with proper keys
      const imagesToUpload = {};
      Object.keys(images).forEach(key => {
        if (images[key]) {
          imagesToUpload[key] = images[key];
        }
      });

      await pageContentService.updatePageContent(
        FUNDS_MANAGEMENT_PAGE_DEFINITION.pageKey,
        content,
        token,
        imagesToUpload
      );

      setSuccess('Content saved successfully!');
      setImages({});
      setImagePreviews({});
    } catch (err) {
      console.error('Failed to save content:', err);
      setError(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const currentSection = FUNDS_MANAGEMENT_PAGE_DEFINITION.sections[activeSection];
  const currentContent = content[activeSection] || {};

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Funds Management Page Content</h1>
          <p className="text-gray-600">Manage content for the funds management page</p>
        </div>

        {/* Error/Success Messages */}
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
            {Object.entries(FUNDS_MANAGEMENT_PAGE_DEFINITION.sections).map(([key, section]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSection(key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${
                  activeSection === key
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
            {Object.entries(currentSection.fields).map(([field, label]) => {
              const value = currentContent[field]?.[activeLang] || '';
              
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} ({activeLang.toUpperCase()})
                  </label>
                  {field.includes('description') ? (
                    <textarea
                      value={value}
                      onChange={(e) => handleFieldChange(activeSection, field, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] focus:border-[#00437a] text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleFieldChange(activeSection, field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] focus:border-[#00437a] text-sm"
                    />
                  )}
                </div>
              );
            })}

            {/* Image Fields */}
            {Object.entries(currentSection.imageFields).map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(activeSection, field, e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-[#00437a]"
                  />
                  {imagePreviews[`${activeSection}-${field}`] && (
                    <div className="mt-2">
                      <img
                        src={imagePreviews[`${activeSection}-${field}`]}
                        alt={label}
                        className="h-32 w-auto object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  {currentContent[field] && !imagePreviews[`${activeSection}-${field}`] && (
                    <div className="mt-2">
                      <img
                        src={currentContent[field]?.startsWith('http') 
                          ? currentContent[field] 
                          : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${currentContent[field]}`}
                        alt={label}
                        className="h-32 w-auto object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#00437a] text-white rounded-lg hover:bg-[#003060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundsManagementPageContentEditor;