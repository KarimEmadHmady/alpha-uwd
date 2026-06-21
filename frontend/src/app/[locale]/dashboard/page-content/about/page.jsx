'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

// تعريف صفحة About - كل السيكشنز من الصفحة الفعلية
const ABOUT_PAGE_DEFINITION = {
  pageKey: 'about',
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
    about: {
      label: 'About Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Title',
        description: 'Description',
        bullet1: 'Bullet Point 1',
        bullet2: 'Bullet Point 2',
        bullet3: 'Bullet Point 3',
        stat1Value: 'Stat 1 Value',
        stat1Label: 'Stat 1 Label',
        stat2Value: 'Stat 2 Value',
        stat2Label: 'Stat 2 Label',
        stat3Value: 'Stat 3 Value',
        stat3Label: 'Stat 3 Label',
      },
      imageFields: {
        teamImage: 'Team Image',
      },
    },
    boardOfDirectors: {
      label: 'Board of Directors Section',
      fields: {
        badgeText: 'Badge Text',
        member1Name: 'Member 1 Name',
        member1Title: 'Member 1 Title',
        member2Name: 'Member 2 Name',
        member2Title: 'Member 2 Title',
        member3Name: 'Member 3 Name',
        member3Title: 'Member 3 Title',
        member4Name: 'Member 4 Name',
        member4Title: 'Member 4 Title',
        member5Name: 'Member 5 Name',
        member5Title: 'Member 5 Title',
        member6Name: 'Member 6 Name',
        member6Title: 'Member 6 Title',
      },
      imageFields: {
        member1Image: 'Member 1 Image',
        member2Image: 'Member 2 Image',
        member3Image: 'Member 3 Image',
        member4Image: 'Member 4 Image',
        member5Image: 'Member 5 Image',
        member6Image: 'Member 6 Image',
      },
    },
    ourStory: {
      label: 'Our Story Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Title',
        description1: 'Description 1',
        description2: 'Description 2',
        description3: 'Description 3',
        ctaText: 'CTA Button Text',
        ctaLink: 'CTA Link',
        timeline1Year: 'Timeline 1 Year',
        timeline1Title: 'Timeline 1 Title',
        timeline1Desc: 'Timeline 1 Description',
        timeline2Year: 'Timeline 2 Year',
        timeline2Title: 'Timeline 2 Title',
        timeline2Desc: 'Timeline 2 Description',
        timeline3Year: 'Timeline 3 Year',
        timeline3Title: 'Timeline 3 Title',
        timeline3Desc: 'Timeline 3 Description',
        timeline4Year: 'Timeline 4 Year',
        timeline4Title: 'Timeline 4 Title',
        timeline4Desc: 'Timeline 4 Description',
        timeline5Year: 'Timeline 5 Year',
        timeline5Title: 'Timeline 5 Title',
        timeline5Desc: 'Timeline 5 Description',
      },
    },
    partners: {
      label: 'Partners Section',
      fields: {
        title: 'Title',
      },
      imageFields: {
        partner1Logo: 'Partner 1 Logo',
        partner2Logo: 'Partner 2 Logo',
        partner3Logo: 'Partner 3 Logo',
        partner4Logo: 'Partner 4 Logo',
        partner5Logo: 'Partner 5 Logo',
        partner6Logo: 'Partner 6 Logo',
      },
    },
    whyChooseUs: {
      label: 'Why Choose Us Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Title',
        description: 'Description',
        ctaText: 'CTA Button Text',
        ctaLink: 'CTA Link',
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
  'teamImage',
  'member1Image',
  'member2Image',
  'member3Image',
  'member4Image',
  'member5Image',
  'member6Image',
  'partner1Logo',
  'partner2Logo',
  'partner3Logo',
  'partner4Logo',
  'partner5Logo',
  'partner6Logo',
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

const AboutPageContentEditor = () => {
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

  // Load existing content for "about" page
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pageContentService.getPageContent(ABOUT_PAGE_DEFINITION.pageKey).catch(() => null);
        
        if (response && response.content) {
          setContent(ensureContentStructure(response.content));
        } else {
          // Initialize empty structure if not found
          setContent({});
        }
      } catch (err) {
        console.error('Failed to load about page content:', err);
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
        ABOUT_PAGE_DEFINITION.pageKey, content, token, images
      );
      
      // حدّث الـ content بالـ paths الفعلية من الـ response
      if (result.content) setContent(ensureContentStructure(result.content));
      setImages({});
      setImagePreviews({});
      setSuccess('About page content saved successfully.');
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

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">About Page Content</h1>
        <p className="text-gray-500 text-sm">
          Manage dynamic text content for the public about page. Changes are served via API and used by Web & Flutter.
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
          {Object.entries(ABOUT_PAGE_DEFINITION.sections).map(([key, section]) => (
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
          {/* Text Fields - موجودة */}
          {Object.entries(ABOUT_PAGE_DEFINITION.sections[activeSection].fields).map(([fieldKey, label]) => {
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

          {/* Image Fields - جديد */}
          {Object.keys(ABOUT_PAGE_DEFINITION.sections[activeSection].imageFields || {}).length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Images</h3>
              {Object.entries(ABOUT_PAGE_DEFINITION.sections[activeSection].imageFields).map(([fieldKey, label]) => {
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
                        src={preview || `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${existingPath}`}
                        alt={label}
                        className="w-40 h-24 object-contain rounded-lg mb-2 border"
                      />
                    )}
                    
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleImageChange(activeSection, fieldKey, e.target.files[0])}
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

export default AboutPageContentEditor;

