import PortfolioManagementCard from './Portfoliomanagementcard';

async function getPortfolioManagementContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/portfolio-management?lang=all`,
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
  title: 'Portfolio Management',
  boldLeadIn: 'Alpha Financial Investments',
  description:
    'is one of the leading companies in the field of portfolio formation and investment management. The company obtained its license from the Financial Regulatory Authority in 2009, and since then it has been providing its services to a diverse client base that includes individuals and institutional entities in both the public and private sectors. The company is committed to designing precise investment strategies that align with each client\u2019s objectives and risk profile. Alpha manages a wide range of investment portfolios, including private pension fund portfolios, equity portfolios for banks and public institutions, balanced portfolios for institutional clients, insurance company portfolios, and Islamic portfolios that comply with Sharia principles. The company continuously monitors financial markets and analyzes market trends, allowing it to adjust and develop investment strategies in response to economic and financial changes, with the aim of maximizing returns, minimizing risks, strengthening client confidence, and achieving sustainable growth for their investments.',
  serviceImage: '/services/portfolio-management2.jpg',
};

export default async function PortfolioManagementCardWrapper({ lang }: { lang: string }) {
  const card = await getPortfolioManagementContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <PortfolioManagementCard data={card} BASE_URL={BASE_URL} lang={lang} />;
}