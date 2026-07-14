import OurStorySection from './Ourstorysection';

async function getOurStoryContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/about?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const ourStory = data.content?.ourStory ?? null;

    if (!ourStory) return null;

    // Extract multilingual content and handle images
    const result: any = {};

    for (const [key, value] of Object.entries(ourStory)) {
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
  badgeText: 'Our Story',
  title: 'Shaping A Future Of Intelligent Finance',
  description1: 'Alpha Financial Investments Has Been Managing Diverse Investment Funds Since Obtaining Its FRA License In 2016.',
  description2: 'With A Clear Vision And An Experienced Team, The Company Delivers Professional Fund Management.',
  description3: 'It Focuses On Sustainable Returns And Reinforcing Its Position As A Trusted Financial Partner.',
  ctaText: "Let's Talk",
  ctaLink: '#',
  timeline1Year: '2009',
  timeline1Title: 'Establishment Of The Company',
  timeline1Desc: '',
  timeline2Year: '2016',
  timeline2Title: 'Awarded The Management Of The Egyptian Land Bank Fund',
  timeline2Desc: '',
  timeline3Year: '2021',
  timeline3Title: 'The Acquisition Of Alpha Financial Investments By Odin Investments',
  timeline3Desc: 'Management Of Al Masreyeen Real Estate Fund, Odin Kasb Fund, And Delta Life Insurance Fund.',
  timeline4Year: '2024',
  timeline4Title: 'OZ Fixed Income Investment Fund (First USD Issuance)',
  timeline4Desc: '',
  timeline5Year: '2025',
  timeline5Title: 'OZ Investment Fund (Second Euro Issuance)',
  timeline5Desc: 'Odin Money Market Fund (Odin IV), And Odin Equity Investment Fund (Trend – First Issuance).',
};

export default async function OurStorySectionWrapper({ lang }: { lang: string }) {
  const ourStory = await getOurStoryContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <OurStorySection data={ourStory} BASE_URL={BASE_URL} lang={lang} />;
}
