"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────
interface BlogDetail {
  id?: number;
  date?: string;
  title?: string;
  description?: string;
  image?: string;
}

const buildImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/fallback-blog.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (!baseUrl) return imagePath;
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

// ── Component ──────────────────────────────────────────────────────────
export default function BlogDetailPage({ lang = 'en', blogId }: { lang?: string; blogId: string }) {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [otherBlogs, setOtherBlogs] = useState<BlogDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/blogs?lang=all`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        const blogs = data.content?.blogs ?? [];
        
        // Find the current blog by ID
        const currentBlog = blogs.find((b: any) => 
  b.id?.toString() === blogId
) || blogs[parseInt(blogId) - 1]; 
        if (currentBlog) {
          const processedBlog: BlogDetail = {};
          
          // Map fields directly
          if (currentBlog.id) processedBlog.id = currentBlog.id;
          
          // Handle multilingual fields
          if (currentBlog.title) {
            const titleValue = currentBlog.title as any;
            processedBlog.title = typeof titleValue === 'string' 
              ? titleValue 
              : (titleValue[lang as 'ar' | 'en'] || titleValue.ar || titleValue.en || '');
          }
          
          if (currentBlog.description) {
            const descValue = currentBlog.description as any;
            processedBlog.description = typeof descValue === 'string' 
              ? descValue 
              : (descValue[lang as 'ar' | 'en'] || descValue.ar || descValue.en || '');
          }
          
          if (currentBlog.date) {
            const dateValue = currentBlog.date as any;
            processedBlog.date = typeof dateValue === 'string' 
              ? dateValue 
              : (dateValue[lang as 'ar' | 'en'] || dateValue.ar || dateValue.en || '');
          }
          
          // Handle image field (string)
          if (currentBlog.image) {
            processedBlog.image = currentBlog.image as string;
          }
          
          setBlog(processedBlog);
        }
        
        // Get other blogs (exclude current)
        const others = blogs.filter((b: any) => b.id?.toString() !== blogId).slice(0, 3).map((b: any) => {
          const other: BlogDetail = { id: b.id };
          
          if (b.title) {
            const titleValue = b.title as any;
            other.title = typeof titleValue === 'string' 
              ? titleValue 
              : (titleValue[lang as 'ar' | 'en'] || titleValue.ar || titleValue.en || '');
          }
          
          if (b.date) {
            const dateValue = b.date as any;
            other.date = typeof dateValue === 'string' 
              ? dateValue 
              : (dateValue[lang as 'ar' | 'en'] || dateValue.ar || dateValue.en || '');
          }
          
          if (b.image) {
            other.image = b.image as string;
          }
          
          return other;
        });
        setOtherBlogs(others);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, lang]);

  if (loading) return <div className="w-full max-w-5xl mx-auto px-4 py-12">Loading...</div>;
  if (!blog) return <div className="w-full max-w-5xl mx-auto px-4 py-12">Blog not found</div>;

  const safeTitle = blog.title || 'Untitled Blog';
  const safeDate = blog.date || 'Unknown Date';
  const safeDescription = blog.description || 'No description available';
  const imageUrl = buildImageUrl(blog.image);

return (
  <section className="w-full max-w-5xl mx-auto px-4 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* ── Main Content ── */}
      <article className="flex-1 min-w-0">
        {/* Hero image */}
        <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 mb-5">
          <Image
            src={imageUrl}
            alt={safeTitle}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-[#00437A] dark:text-blue-400 mb-3">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z" />
          </svg>
          <span>{safeDate}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-50 leading-tight mb-5">
          {safeTitle}
        </h1>

        {/* Body */}
        <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {safeDescription}
        </div>
      </article>

      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-64 shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-4">
          {lang === 'ar' ? 'مدونات أخرى' : 'Other Blogs'}
        </h2>
        <div className="space-y-4">
          {otherBlogs.map((b) => (
            <SidebarCard key={b.id} blog={b} lang={lang} />
          ))}
        </div>
      </aside>
    </div>
  </section>
);
}

// ── Sidebar Card ───────────────────────────────────────────────────────
function SidebarCard({ blog, lang }: { blog: BlogDetail; lang?: string }) {
  const id = blog.id || 1;
  const imageUrl = buildImageUrl(blog.image);
  const safeTitle = blog.title || 'Untitled Blog';
  const safeDate = blog.date || 'Unknown Date';

return (
  <Link href={`/blogs/${id}`} className="group block">
    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#1a1a1a]">
      {/* Image */}
      <div className="relative w-full h-32 bg-gray-200 dark:bg-gray-700">
        <Image
          src={imageUrl}
          alt={safeTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-2">
        <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-50 leading-tight line-clamp-2">
          {safeTitle}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{safeDate}</p>
      </div>
    </div>
  </Link>
);
}