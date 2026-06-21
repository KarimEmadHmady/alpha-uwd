'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

const COMMITTEE_PAGE_DEFINITION = {
  pageKey: 'committee',
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
    committee: {
      label: 'Committee Section',
      fields: {
        title: 'Title',
        subtitle: 'Subtitle',
        centralRiskTabLabel: 'Central Risk Committee Tab Label',
        auditTabLabel: 'Audit Committee Tab Label',
        centralRiskMember1Name: 'Central Risk Member 1 Name',
        centralRiskMember1Title: 'Central Risk Member 1 Title',
        centralRiskMember2Name: 'Central Risk Member 2 Name',
        centralRiskMember2Title: 'Central Risk Member 2 Title',
        centralRiskMember3Name: 'Central Risk Member 3 Name',
        centralRiskMember3Title: 'Central Risk Member 3 Title',
        centralRiskMember4Name: 'Central Risk Member 4 Name',
        centralRiskMember4Title: 'Central Risk Member 4 Title',
        centralRiskMember5Name: 'Central Risk Member 5 Name',
        centralRiskMember5Title: 'Central Risk Member 5 Title',
        centralRiskMember6Name: 'Central Risk Member 6 Name',
        centralRiskMember6Title: 'Central Risk Member 6 Title',
        auditMember1Name: 'Audit Member 1 Name',
        auditMember1Title: 'Audit Member 1 Title',
        auditMember2Name: 'Audit Member 2 Name',
        auditMember2Title: 'Audit Member 2 Title',
        auditMember3Name: 'Audit Member 3 Name',
        auditMember3Title: 'Audit Member 3 Title',
        auditMember4Name: 'Audit Member 4 Name',
        auditMember4Title: 'Audit Member 4 Title',
        auditMember5Name: 'Audit Member 5 Name',
        auditMember5Title: 'Audit Member 5 Title',
        auditMember6Name: 'Audit Member 6 Name',
        auditMember6Title: 'Audit Member 6 Title',
      },
      imageFields: {
        centralRiskMember1Image: 'Central Risk Member 1 Image',
        centralRiskMember2Image: 'Central Risk Member 2 Image',
        centralRiskMember3Image: 'Central Risk Member 3 Image',
        centralRiskMember4Image: 'Central Risk Member 4 Image',
        centralRiskMember5Image: 'Central Risk Member 5 Image',
        centralRiskMember6Image: 'Central Risk Member 6 Image',
        auditMember1Image: 'Audit Member 1 Image',
        auditMember2Image: 'Audit Member 2 Image',
        auditMember3Image: 'Audit Member 3 Image',
        auditMember4Image: 'Audit Member 4 Image',
        auditMember5Image: 'Audit Member 5 Image',
        auditMember6Image: 'Audit Member 6 Image',
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
  'centralRiskMember1Image',
  'centralRiskMember2Image',
  'centralRiskMember3Image',
  'centralRiskMember4Image',
  'centralRiskMember5Image',
  'centralRiskMember6Image',
  'auditMember1Image',
  'auditMember2Image',
  'auditMember3Image',
  'auditMember4Image',
  'auditMember5Image',
  'auditMember6Image',
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

const CommitteePageContentEditor = () => {
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

  // Load existing content for "committee" page
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pageContentService.getPageContent(COMMITTEE_PAGE_DEFINITION.pageKey).catch(() => null);
        
        if (response && response.content) {
          setContent(ensureContentStructure(response.content));
        } else {
          // Initialize empty structure if not found
          setContent({});
        }
      } catch (err) {
        console.error('Failed to load committee page content:', err);
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
        COMMITTEE_PAGE_DEFINITION.pageKey, content, token, images
      );
      
      // حدّث الـ content بالـ paths الفعلية من الـ response
      if (result.content) setContent(ensureContentStructure(result.content));
      setImages({});
      setImagePreviews({});
      setSuccess('Committee page content saved successfully.');
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00437a]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Committee Page Content</h1>
          <p className="text-gray-600 mt-1">Manage committee page content in multiple languages</p>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex gap-1 mb-6 border-b">
          {Object.entries(COMMITTEE_PAGE_DEFINITION.sections).map(([key, section]) => (
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
          {Object.entries(COMMITTEE_PAGE_DEFINITION.sections[activeSection].fields).map(([fieldKey, label]) => {
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
          {Object.keys(COMMITTEE_PAGE_DEFINITION.sections[activeSection].imageFields || {}).length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Images</h3>
              {Object.entries(COMMITTEE_PAGE_DEFINITION.sections[activeSection].imageFields).map(([fieldKey, label]) => {
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

export default CommitteePageContentEditor;
