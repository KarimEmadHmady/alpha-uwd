import FamilyBusinessPortfoliosCard from './Familybusinessportfolioscard';

async function getManagingFamilyBusinessContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/managing-family-business?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const card = data.content?.card ?? null;

    if (!card) return null;

    // Extract multilingual content and handle images
    const result: any = {};

    for (const [key, value] of Object.entries(card)) {
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
  eyebrowText: 'Our Services',
  title: 'Managing Family Business Portfolios',
  boldLeadIn: 'Alpha Financial Investments',
  description:
    'provides family portfolio management services, whether in the form of individual portfolios or family-owned companies, by designing tailored investment strategies that accurately meet the specific needs of this client segment. Investment plans are developed based on their advisory objectives and acceptable risk levels, with funds allocated across diversified investment channels to ensure optimal returns while maintaining sustainable financial stability over the long term.',
  serviceImage: '/services/family-business-portfolios2.jpg',
};

export default async function FamilyBusinessPortfoliosCardWrapper({ lang }: { lang: string }) {
  const card = await getManagingFamilyBusinessContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <FamilyBusinessPortfoliosCard data={card} BASE_URL={BASE_URL} lang={lang} />;
}