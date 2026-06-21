'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

const BLOGS_PAGE_DEFINITION = {
  pageKey: 'blogs',
  sections: {
    hero: {
      label: 'Hero Section',
      fields: {
        badgeText: 'Badge Text',
        title: 'Title',
        subtitle: 'Subtitle',
        ctaText: 'CTA Button Text',
      },
      imageFields: {
        heroImage: 'Hero Image',
      },
    },
    blogs: {
      label: 'Blogs',
      fields: {},
      imageFields: {},
    },
  },
};

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

const IMAGE_FIELDS = new Set(['image', 'featuredImage', 'heroImage']);

const ensureContentStructure = (content) => {
  if (!content || typeof content !== 'object') return { hero: {}, blogs: [] };

  // ── Hero ──
  const hero = {};
  const rawHero = content.hero || {};
  for (const [key, value] of Object.entries(rawHero)) {
    if (IMAGE_FIELDS.has(key)) {
      hero[key] = typeof value === 'object' ? (value.ar || value.en || '') : String(value || '');
    } else if (value && typeof value === 'object' && (value.ar !== undefined || value.en !== undefined)) {
      hero[key] = value;
    } else {
      hero[key] = { ar: String(value || ''), en: String(value || '') };
    }
  }

  // ── Blogs array ──
  const blogs = Array.isArray(content.blogs) ? content.blogs.map((blog) => {
    if (!blog || typeof blog !== 'object') return blog;
    const processedBlog = {};
    for (const [key, value] of Object.entries(blog)) {
      if (IMAGE_FIELDS.has(key)) {
        processedBlog[key] = typeof value === 'object' ? (value.ar || value.en || '') : String(value || '');
      } else if (value && typeof value === 'object' && (value.ar !== undefined || value.en !== undefined)) {
        processedBlog[key] = value;
      } else if (key !== 'id' && key !== '_id') {
        processedBlog[key] = { ar: String(value || ''), en: String(value || '') };
      } else {
        processedBlog[key] = value;
      }
    }
    return processedBlog;
  }) : [];

  return { hero, blogs };
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

const BlogsPageContentEditor = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeLang, setActiveLang] = useState('ar');
  const [images, setImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [content, setContent] = useState({ hero: {}, blogs: [] });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await pageContentService.getPageContent(BLOGS_PAGE_DEFINITION.pageKey).catch(() => null);
        if (response && response.content) {
          setContent(ensureContentStructure(response.content));
        } else {
          setContent({ hero: {}, blogs: [] });
        }
      } catch (err) {
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  // ── Hero image change ──
  const handleHeroImageChange = (fieldKey, file) => {
    if (!file) return;
    const key = `hero.${fieldKey}`;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreviews(prev => ({ ...prev, [key]: e.target.result }));
    reader.readAsDataURL(file);
    setImages(prev => ({ ...prev, [key]: file }));
    setContent(prev => ({ ...prev, hero: { ...prev.hero, [fieldKey]: file.name } }));
  };

  // ── Hero field change ──
  const handleHeroFieldChange = (fieldKey, lang, value) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [fieldKey]: { ...(prev.hero[fieldKey] || {}), [lang]: value },
      },
    }));
  };

  // ── Blog image change ──
  const handleBlogImageChange = (blogIndex, file) => {
    if (!file) return;
    const key = `blogs.${blogIndex}.image`;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreviews(prev => ({ ...prev, [key]: e.target.result }));
    reader.readAsDataURL(file);
    setImages(prev => ({ ...prev, [key]: file }));
    setContent(prev => ({
      ...prev,
      blogs: prev.blogs.map((blog, idx) =>
        idx === blogIndex ? { ...blog, image: file.name } : blog
      ),
    }));
  };

  // ── Blog field change ──
  const handleBlogFieldChange = (blogIndex, fieldKey, lang, value) => {
    setContent(prev => ({
      ...prev,
      blogs: prev.blogs.map((blog, idx) => {
        if (idx !== blogIndex) return blog;
        return { ...blog, [fieldKey]: { ...(blog[fieldKey] || {}), [lang]: value } };
      }),
    }));
  };

  const addBlog = () => {
    setContent(prev => {
      const newBlogs = [...prev.blogs, {
        id: Date.now(), 
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        date: { ar: '', en: '' },
        image: '',
      }];
      setTimeout(() => setEditingIndex(newBlogs.length - 1), 0);
      return { ...prev, blogs: newBlogs };
    });
  };

  const removeBlog = (index) => {
    setContent(prev => ({ ...prev, blogs: prev.blogs.filter((_, idx) => idx !== index) }));
    setEditingIndex(null);
  };

  const handleSave = async () => {
    if (!token) { setError('You must be logged in as admin to save.'); return; }
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const result = await pageContentService.updatePageContent(
        BLOGS_PAGE_DEFINITION.pageKey, content, token, images
      );
      if (result.content) setContent(ensureContentStructure(result.content));
      setImages({});
      setImagePreviews({});
      setSuccess('Blogs content saved successfully.');
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
        <h1 className="text-2xl font-bold mb-2">Blogs Content</h1>
        <p className="text-gray-500 text-sm">Manage hero section and blog posts.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

      <div className="bg-white rounded-2xl shadow-xl p-6">

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 border-b mb-4">
          {Object.entries(BLOGS_PAGE_DEFINITION.sections).map(([key, section]) => (
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

        {/* ── Hero Section ── */}
        {activeSection === 'hero' && (
          <div className="space-y-4">
            {Object.entries(BLOGS_PAGE_DEFINITION.sections.hero.fields).map(([fieldKey, label]) => (
              <div key={fieldKey}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={content.hero?.[fieldKey]?.[activeLang] || ''}
                  onChange={(e) => handleHeroFieldChange(fieldKey, activeLang, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] text-sm"
                />
              </div>
            ))}

            {/* Hero Image */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Images</h3>
              {Object.entries(BLOGS_PAGE_DEFINITION.sections.hero.imageFields).map(([fieldKey, label]) => {
                const previewKey = `hero.${fieldKey}`;
                const existingPath = content.hero?.[fieldKey];
                const preview = imagePreviews[previewKey];
                return (
                  <div key={fieldKey} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
                      onChange={(e) => handleHeroImageChange(fieldKey, e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#00437a] file:text-white hover:file:bg-[#005a9c]"
                    />
                    {existingPath && !preview && (
                      <p className="text-xs text-gray-400 mt-1">{existingPath}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Blogs Section ── */}
        {activeSection === 'blogs' && (
          <>
            <div className="space-y-6 mb-6">
              {content.blogs && content.blogs.length > 0 ? (
                content.blogs.map((blog, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      editingIndex === index
                        ? 'border-[#00437a] bg-blue-50'
                        : 'border-gray-200 hover:border-[#00437a]'
                    }`}
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {blog.title?.[activeLang] || `Blog #${index + 1}`}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {blog.date?.[activeLang] || 'No date'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeBlog(index); }}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition"
                      >
                        Remove
                      </button>
                    </div>

                    {editingIndex === index && (
                      <div className="mt-4 space-y-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
                        {/* Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Blog Image</label>
                          {(imagePreviews[`blogs.${index}.image`] || blog.image) && (
                            <img
                              src={imagePreviews[`blogs.${index}.image`] || `${BASE_URL}/${blog.image}`}
                              alt="Blog"
                              className="w-40 h-24 object-cover rounded-lg mb-2 border"
                            />
                          )}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleBlogImageChange(index, e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#00437a] file:text-white hover:file:bg-[#005a9c]"
                          />
                        </div>
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title ({activeLang.toUpperCase()})</label>
                          <input
                            type="text"
                            value={blog.title?.[activeLang] || ''}
                            onChange={(e) => handleBlogFieldChange(index, 'title', activeLang, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] text-sm"
                          />
                        </div>
                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description ({activeLang.toUpperCase()})</label>
                          <textarea
                            value={blog.description?.[activeLang] || ''}
                            onChange={(e) => handleBlogFieldChange(index, 'description', activeLang, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] text-sm"
                          />
                        </div>
                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date ({activeLang.toUpperCase()})</label>
                          <input
                            type="text"
                            value={blog.date?.[activeLang] || ''}
                            onChange={(e) => handleBlogFieldChange(index, 'date', activeLang, e.target.value)}
                            placeholder="e.g., 2024-06-03"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a] text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No blogs yet. Click "Add Blog" to create one.</p>
              )}
            </div>

            <button
              type="button"
              onClick={addBlog}
              className="mb-6 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              + Add Blog
            </button>
          </>
        )}

        {/* Save */}
        <div className="flex justify-end gap-3 border-t pt-4 mt-4">
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

export default BlogsPageContentEditor;