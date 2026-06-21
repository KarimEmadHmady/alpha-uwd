import FinancialServicesGrid from './Financialservicesgrid';

async function getServicesContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/services?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const services = data.content?.services ?? null;
    
    if (!services) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(services)) {
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
  service1Title: 'Funds Management',
  service1Description: 'We manage a diverse range of investment funds tailored to your financial goals.',
  service1Image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=220&fit=crop',
  service2Title: 'Portfolio Management',
  service2Description: 'One of the leading companies in portfolio strategy and asset allocation.',
  service2Image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=220&fit=crop',
  service3Title: 'Cash Management',
  service3Description: 'Alpha Financial Investments provides expert cash flow optimization.',
  service3Image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=220&fit=crop',
  service4Title: 'Private Pension Funds',
  service4Description: 'Specializes in managing private pension portfolios for long-term security.',
  service4Image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=220&fit=crop',
  service5Title: 'Managing Family Business',
  service5Description: 'Provides family portfolio management and multi-generational wealth planning.',
  service5Image: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400&h=220&fit=crop',
};

export default async function FinancialServicesGridWrapper({ lang }: { lang: string }) {
  const services = await getServicesContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  
  return <FinancialServicesGrid data={services} BASE_URL={BASE_URL} lang={lang} />;
}
