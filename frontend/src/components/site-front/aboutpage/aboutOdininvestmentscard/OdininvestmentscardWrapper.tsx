import OdinInvestmentsCard from './Odininvestmentscard';

async function getHoldingCompanyContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/holdingcompany?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const holdingCompany = data.content?.holdingCompany ?? null;
    
    if (!holdingCompany) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(holdingCompany)) {
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
  badgeText: 'Holding Company',
  title: 'Odin Investments',
  description1: 'ODIN Investments is a leading EGX-listed financial services provider with a distinguished track record in capital markets accumulated over the last 40 years. The company is an extension to "Egyptians Abroad for Investment and Development", a company that has contributed throughout its history to the sustainable development in Egypt, as it contributed to the establishment of several companies in different sectors.',
  description2: 'ODIN currently operates as a fully-fledged investment bank after undergoing a major restructuring in 2020. The company offers investment banking, asset management, and private equity services with dedicated teams of the highest caliber. Since rebranding into ODIN Investments, the company has executed a number of transactions in the Egyptian market from IPOs to M&As to restructuring of distressed companies, which has placed it among the top performing financial services providers over the last few years.',
  description3: 'ODIN has been a pioneer in the financial industry and has introduced innovative investment vehicles to the market as it established the first real estate investment fund in Egypt back in 2018. The company looks to build on the amazing success achieved over the last few years and to continue enhancing the quality and variety of services on offer with a huge focus on innovation and building a sustainable business environment.',
  buttonText: 'View Website',
  websiteUrl: 'https://www.odininvestments.com',
  companyImage: 'https://odin-building.jpg',
};

export default async function OdinInvestmentsCardWrapper({ lang }: { lang: string }) {
  const holdingCompany = await getHoldingCompanyContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  
  return <OdinInvestmentsCard data={holdingCompany} BASE_URL={BASE_URL} lang={lang}/>;
}
