import HeroSection from './HeroSection';

async function getFundsManagementHeroContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/fundsmanagement?lang=all`,
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
  badgeText: 'Welcome To Alpha Asset Management',
  title: 'Services',
  subtitle: 'We offer a wide range of services to support you in the best possible',
  ctaText: "Let's Talk",
  ctaLink: '#',
  totalUsersLabel: 'Total Users',
  trustLabel: 'From',
  backgroundImage: '/Group 5.png',
  heroImage: '/hero-person-about.png',
};

export default async function FundsManagementHeroSectionWrapper({ lang }: { lang: string }) {
  const hero = await getFundsManagementHeroContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  
  return <HeroSection data={hero} BASE_URL={BASE_URL} lang={lang} />;
}
