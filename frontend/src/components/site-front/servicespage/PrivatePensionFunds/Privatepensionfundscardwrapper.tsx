import PrivatePensionFundsCard from './PrivatePensionFundsCard';

async function getPrivatePensionFundsContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/private-pension-funds?lang=all`,
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
  title: 'Private Pension Funds',
  boldLeadIn: 'Alpha Financial Investments Management Company',
  description:
    'specializes in managing private pension funds by managing securities portfolios for those funds in light of the Unified Insurance Law No. 155 of 2024 and the Board of Directors of the Authority Resolution No. 269 of 2024. The company manages a diverse group of private pension funds with a total value exceeding 8 billion Egyptian pounds.',
  serviceImage: '/services/private-pension-funds2.jpg',
};

export default async function PrivatePensionFundsCardWrapper({ lang }: { lang: string }) {
  const card = await getPrivatePensionFundsContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <PrivatePensionFundsCard data={card} BASE_URL={BASE_URL} lang={lang} />;
}