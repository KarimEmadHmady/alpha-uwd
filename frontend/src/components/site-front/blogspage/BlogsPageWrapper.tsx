import BlogsPage from './BlogsPage';

async function getBlogsContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/blogs?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const blogs = data.content?.blogs ?? null;
    
    if (!blogs) return null;
    
    // Extract multilingual content and handle images
return blogs.map((blog: any, index: number) => {
  const result: any = {};
  
  for (const [key, value] of Object.entries(blog)) {
    if (key === 'image' || key === 'id') {
      result[key] = value; // ← أضف 'id' هنا
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const multilingualValue = value as { ar?: string; en?: string };
      result[key] = multilingualValue[lang as 'ar' | 'en'] || multilingualValue.ar || multilingualValue.en || '';
    } else {
      result[key] = value;
    }
  }
  
  // fallback لو مفيش id
  if (!result.id) result.id = index + 1;
  
  return result;
});
  } catch {
    return null;
  }
}

export default async function BlogsPageWrapper({ lang }: { lang: string }) {
  const blogs = await getBlogsContent(lang) ?? [];
  
  return <BlogsPage blogs={blogs} lang={lang} />;
}
