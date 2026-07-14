import WhyChooseUsSection from './Whychooseussection';

async function getWhyChooseUsContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/about?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const whyChooseUs = data.content?.whyChooseUs ?? null;

    if (!whyChooseUs) return null;

    // Extract multilingual content and handle images
    const result: any = {};

    for (const [key, value] of Object.entries(whyChooseUs)) {
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
  badgeText: 'Why Choose Us',
  title: 'Trusted Expertise To Grow And Protect Your Wealth',
  description: 'Trusted By Thousands Who\'ve Built Smarter, More Secure Financial Futures With Alpha',
  ctaText: 'View All Services',
  ctaLink: '#',
};

export default async function WhyChooseUsSectionWrapper({ lang }: { lang: string }) {
  const whyChooseUs = await getWhyChooseUsContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <WhyChooseUsSection data={whyChooseUs} BASE_URL={BASE_URL} lang={lang} />;
}
