import HeroSection from './HeroSection';

async function getHeroContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/blogs?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const hero = data.content?.hero ?? null;
    if (!hero) return null;

    const result: any = {};
    for (const [key, value] of Object.entries(hero)) {
      if (key.endsWith('Image')) {
        result[key] = value;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const v = value as { ar?: string; en?: string };
        result[key] = v[lang as 'ar' | 'en'] || v.ar || v.en || '';
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
  badgeText: 'Welcome To Alpha Asset Management',
  title: 'Blogs',
  subtitle: 'Explore articles, tips, and in-depth analysis written',
  ctaText: "Let's Talk",
  heroImage: '/herosec-careers.png',
  backgroundImage: '/Group 5.png',
};

export default async function HeroSectionWrapper({ lang }: { lang: string }) {
  const hero = await getHeroContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  return <HeroSection data={hero} BASE_URL={BASE_URL} lang={lang} />;
}