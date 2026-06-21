import Image from 'next/image';
import Link from 'next/link';

async function getBlogsContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/home?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const blogs = data.content?.blogs ?? null;
    
    if (!blogs) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(blogs)) {
      if (key.startsWith('blog') && key.endsWith('Image')) {
        // Image fields are strings, not multilingual
        result[key] = value;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Extract language-specific content for multilingual fields
        const multilingualValue = value as { ar?: string; en?: string; [key: string]: string | undefined };
        result[key] = multilingualValue[lang] || multilingualValue.ar || multilingualValue.en || '';
      } else {
        result[key] = value;
      }
    }
    
    return result;
  } catch {
    return null;
  }
}

const FALLBACK = {
  badgeText: 'Our Blogs',
  blog1Title: 'What Is The Success Rate Of A Financial Investment?',
  blog1Date: '09 Sept. 2025',
  blog2Title: 'Secure Their Tomorrow',
  blog2Date: '09 Sept. 2025',
  blog3Title: 'Why People Still Need Financial Professionals',
  blog3Date: '05 Sept. 2025',
  blog1Image: '',
  blog2Image: '',
  blog3Image: '',
  readMoreText: 'Read More',
};

export default async function BlogsSection({ lang }: { lang: string }) {
  const blogs = await getBlogsContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  const BLOGS = [
    {
      img: blogs.blog1Image?.startsWith('http') ? blogs.blog1Image : (blogs.blog1Image ? `${BASE_URL}/${blogs.blog1Image}` : "/blogs/blog-1.jpg"),
      date: blogs.blog1Date,
      title: blogs.blog1Title,
      href: `/${lang}/blogs/1`,
    },
    {
      img: blogs.blog2Image?.startsWith('http') ? blogs.blog2Image : (blogs.blog2Image ? `${BASE_URL}/${blogs.blog2Image}` : "/blogs/blog-2.jpg"),
      date: blogs.blog2Date,
      title: blogs.blog2Title,
      href: `/${lang}/blogs/2`,
    },
    {
      img: blogs.blog3Image?.startsWith('http') ? blogs.blog3Image : (blogs.blog3Image ? `${BASE_URL}/${blogs.blog3Image}` : "/blogs/blog-3.jpg"),
      date: blogs.blog3Date,
      title: blogs.blog3Title,
      href: `/${lang}/blogs/3`,
    },
  ];

  return (
    <section className="py-20 " dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200 ">
            {blogs.badgeText}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {BLOGS.map((blog, i) => (
            <Link key={i} href={blog.href} className="group block rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  {blog.date}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200  text-sm leading-snug group-hover:text-[#00437A] transition-colors">
                  {blog.title}
                </h3>
                <div className="mt-3 flex items-center gap-1 text-gray-800 dark:text-gray-200  text-xs font-semibold">
                  {blogs.readMoreText}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}