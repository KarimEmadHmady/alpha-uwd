import BoardOfDirectorsSection from './Boardofdirectorssection';

async function getBoardOfDirectorsContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/about?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const boardOfDirectors = data.content?.boardOfDirectors ?? null;

    if (!boardOfDirectors) return null;

    // Extract multilingual content and handle images
    const result: any = {};

    for (const [key, value] of Object.entries(boardOfDirectors)) {
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
  badgeText: 'Board Of Director',
  member1Name: 'DR. Ahmed Darwish',
  member1Title: 'Managing Director Funds & Portfolios Management',
  member2Name: 'MS. Rania Essam',
  member2Title: 'Board Members',
  member3Name: 'MR. Mohamed Hassan',
  member3Title: 'Managing Director - Specialized Investment Funds',
  member4Name: 'DR. Ahmed Shehata',
  member4Title: 'Managing Director REITs & Private Equity Funds',
  member5Name: 'ENG. Heba Saad Zaghoul',
  member5Title: 'Board Members',
  member6Name: 'DR. Ashraf El-Araby',
  member6Title: 'Board Members',
};

export default async function BoardOfDirectorsSectionWrapper({ lang }: { lang: string }) {
  const boardOfDirectors = await getBoardOfDirectorsContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  return <BoardOfDirectorsSection data={boardOfDirectors} BASE_URL={BASE_URL} lang={lang} />;
}
