import TrustedBySection from './TrustedBySection';

async function getTrustedByContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/home?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const trustedBy = data.content?.trustedBy ?? null;
    
    if (!trustedBy) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(trustedBy)) {
      if (key.startsWith('partner') && key.endsWith('Image')) {
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
  trustedByText: 'Trusted By 15,000 Founders & Business Owners',
  partner1Image: '',
  partner2Image: '',
  partner3Image: '',
  partner4Image: '',
  partner5Image: '',
  partner6Image: '',
};

export default async function TrustedBySectionWrapper({ lang }: { lang: string }) {
  const trustedBy = await getTrustedByContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  const PARTNERS = [
    { name: 'ODIN',      src: trustedBy.partner1Image?.startsWith('http') ? trustedBy.partner1Image : (trustedBy.partner1Image ? `${BASE_URL}/${trustedBy.partner1Image}` : "/partners/odin.png") },
    { name: 'Certus',    src: trustedBy.partner2Image?.startsWith('http') ? trustedBy.partner2Image : (trustedBy.partner2Image ? `${BASE_URL}/${trustedBy.partner2Image}` : "/partners/certus.png") },
    { name: 'EgyTrox',   src: trustedBy.partner3Image?.startsWith('http') ? trustedBy.partner3Image : (trustedBy.partner3Image ? `${BASE_URL}/${trustedBy.partner3Image}` : "/partners/egytrox.png") },
    { name: 'GreenCap',  src: trustedBy.partner4Image?.startsWith('http') ? trustedBy.partner4Image : (trustedBy.partner4Image ? `${BASE_URL}/${trustedBy.partner4Image}` : "/partners/greencap.png") },
    { name: 'FinGuard',  src: trustedBy.partner5Image?.startsWith('http') ? trustedBy.partner5Image : (trustedBy.partner5Image ? `${BASE_URL}/${trustedBy.partner5Image}` : "/partners/finguard.png") },
    { name: 'VoltFund',  src: trustedBy.partner6Image?.startsWith('http') ? trustedBy.partner6Image : (trustedBy.partner6Image ? `${BASE_URL}/${trustedBy.partner6Image}` : "/partners/voltfund.png") },
  ];

  return <TrustedBySection partners={PARTNERS} />;
}
