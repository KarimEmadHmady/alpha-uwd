import HeroSection from './HeroSection';

async function getContactHeroContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/contact?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const hero = data.content?.hero ?? null;
    
    if (!hero) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(hero)) {
      if (key.endsWith('Image')) {
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
  badgeText: 'Contact Us',
  title: 'Build The Future',
  subtitle: 'Get in Touch With Us',
  ctaText: "Let's Talk",
  ctaLink: '#',
  totalUsersLabel: 'Total Users',
  trustLabel: 'From',
  backgroundImage: '/Group 5.png',
  heroImage: '/herosec-careers.png',
};

export default async function ContactHeroSectionWrapper({ lang }: { lang: string }) {
  const hero = await getContactHeroContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  
  return <HeroSection data={hero} BASE_URL={BASE_URL}  lang={lang}  />;
}
