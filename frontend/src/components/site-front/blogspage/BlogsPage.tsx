"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Utility ────────────────────────────────────────────────────────────
const buildImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/fallback-blog.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (!baseUrl) return imagePath; // Return path as-is if no base URL
  
  const cleanPath = imagePath.startsWith('/') 
    ? imagePath.slice(1) 
    : imagePath.includes('/') 
      ? imagePath 
      : `uploads/blogs/${imagePath}`;
  
  return `${baseUrl}/${cleanPath}`;
};

// ── Types ──────────────────────────────────────────────────────────────
interface Blog {
  id?: number;
  date?: string;
  title?: string;
  description?: string;
  image?: string;
}

const ITEMS_PER_PAGE = 9;

// ── Component ──────────────────────────────────────────────────────────
export default function BlogsPage({ blogs = [], lang = 'en' }: { blogs?: Blog[]; lang?: string }) {
  const [currentPage, setCurrentPage] = useState(1);

  const ALL_BLOGS = blogs.length > 0 ? blogs : [];
  const totalPages = Math.max(1, Math.ceil(ALL_BLOGS.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleBlogs = ALL_BLOGS.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Build page number array — show at most 4 page buttons
  const pageNumbers = Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1);

return (
  <section className="w-full max-w-5xl mx-auto px-4 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
    {/* ── Grid ── */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>

    {/* ── Pagination ── */}
    <div className="flex items-center justify-center gap-2 mt-10">
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-[#00437A] text-white"
              : "bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 h-8 rounded-full text-sm font-medium bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
      >
        Next
      </button>
    </div>
  </section>
);
}

// ── Blog Card ──────────────────────────────────────────────────────────
function BlogCard({ blog }: { blog: Blog }) {
  const id = blog.id || 1;
  const imageUrl = buildImageUrl(blog.image);
  const safeTitle = blog.title || 'Untitled Blog';
  const safeDate = blog.date || 'Unknown Date';

return (
  <Link href={`/blogs/${id}`} className="group block">
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-full h-44 bg-gray-200 dark:bg-gray-700">
        <Image
          src={imageUrl}
          alt={safeTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Meta */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 text-xs text-[#00437A] dark:text-blue-400 mb-1">
          {/* Calendar icon */}
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z" />
          </svg>
          <span>{safeDate}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-50 leading-snug line-clamp-2">
          {safeTitle}
        </h3>
      </div>
    </div>
  </Link>
);
}