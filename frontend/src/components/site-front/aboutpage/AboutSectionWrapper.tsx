import AboutSection from './AboutSection';

async function getAboutContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/about?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const about = data.content?.about ?? null;
    
    if (!about) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(about)) {
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
  badgeText: 'About Us',
  title: 'Reputable Asset Manager With An Impressive Track',
  description: 'Alpha Financial Investments Is One Of The Leading Companies In The Egyptian Market In The Field Of Investment Fund And Portfolio Management. The Company Began Its Operations In 2009 And Has Since Built A Solid Track Record Of Experience And Achievements In The Financial Services Sector.',
  bullet1: 'The Acquisition Of Alpha Financial Investments By More Of Clients',
  bullet2: 'Provides Liquidity Management Services To High-Net-Worth Institutions',
  bullet3: 'Provides Family Portfolio Management Services',
  stat1Value: '15',
  stat1Label: 'Bn Aums',
  stat2Value: '15+',
  stat2Label: 'Of Experience',
  stat3Value: '20+',
  stat3Label: 'Clients',
  teamImage: '/about-team.jpg',
};

export default async function AboutSectionWrapper({ lang }: { lang: string }) {
  const about = await getAboutContent(lang) ?? FALLBACK;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '').replace(/\/$/, '') || '';
  
  return <AboutSection data={about} BASE_URL={BASE_URL} lang={lang} />;
}
