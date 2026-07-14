import PartnersStripSection from './Partnersstripsection';

async function getPartnersContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/about?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const partners = data.content?.partners ?? null;

    if (!partners) return null;

    // Extract multilingual content and handle images
    const result: any = {};

    for (const [key, value] of Object.entries(partners)) {
      if (key.endsWith('Logo')) {
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
  title: 'Trusted By 15,000 Founders & Business Owners',
  partner1Logo: '/partners/odin.png',
  partner2Logo: '/partners/certus.png',
  partner3Logo: '/partners/egytrox.png',
  partner4Logo: '/partners/greencap.png',
  partner5Logo: '/partners/finguard.png',
  partner6Logo: '/partners/voltfund.png',
};

export default async function PartnersStripSectionWrapper({ lang }: { lang: string }) {
  const partners = await getPartnersContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <PartnersStripSection data={partners} BASE_URL={BASE_URL} lang={lang} />;
}
