import CashManagementCard from './CashManagementCard';

async function getCashManagementContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/cash-management?lang=all`,
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
  title: 'Cash Management',
  boldLeadIn: 'Alpha Financial Investments',
  description:
    'provides liquidity management services to high-net-worth institutions, leveraging its extensive expertise in this field since 2009. The company aims to manage the available liquidity of these institutions with a high level of professionalism by identifying the most suitable investment channels that align with their financial obligations, while achieving the best possible returns in line with prevailing market interest rates. Additionally, the company focuses on ensuring regular cash flows that enable institutions to meet their current and future financial commitments, thereby achieving the highest levels of financial efficiency and stability.',
  serviceImage: '/services/cash-management2.jpg',
};

export default async function CashManagementCardWrapper({ lang }: { lang: string }) {
  const cashManagement = await getCashManagementContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <CashManagementCard data={cashManagement} BASE_URL={BASE_URL} lang={lang} />;
}