import ServiceDescription from './Servicedescription';

async function getFundsManagementContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/fundsmanagement?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const serviceDescription = data.content?.serviceDescription ?? null;
    
    if (!serviceDescription) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(serviceDescription)) {
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
  title: 'Service Description',
  description: 'We Manage A Diverse Range Of Public Investment Funds Designed To Meet The Needs Of Various Types Of Investors. These Funds Follow Well-Defined Investment Strategies That Span Equity Funds, Fixed Income Funds, Multi-Currency Funds, Real Estate Funds, And Closed-End Funds, Aiming To Achieve An Optimal Balance Between Growth, Returns, And Financial Stability.',
  highlight1: 'The Acquisition Of Alpha Financial Investments By More Of Clients',
  highlight2: 'Provides Liquidity Management Services To High-Net-Worth',
  highlight3: 'Provides Family Portfolio Management Services',
  otherServicesTitle: 'Other Services',
  otherService1Label: 'Portfolio Management',
  otherService1Link: '/services/portfolio-management',
  otherService2Label: 'Cash Management',
  otherService2Link: '/services/cash-management',
  otherService3Label: 'Private Pension Funds',
  otherService3Link: '/services/private-pension-funds',
  otherService4Label: 'Managing Family Business',
  otherService4Link: '/services/managing-family-business',
};

export default async function ServiceDescriptionWrapper({ lang }: { lang: string }) {
  const serviceDescription = await getFundsManagementContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  
  return <ServiceDescription data={serviceDescription} BASE_URL={BASE_URL} lang={lang} />;
}
