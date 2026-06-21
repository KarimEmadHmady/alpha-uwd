import CommitteesSupportingBoard from './Committeessupportingboard';

async function getCommitteeContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/committee?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const committee = data.content?.committee ?? null;
    
    if (!committee) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(committee)) {
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
  title: 'Committees Supporting The Board Of Directors',
  subtitle: '',
  centralRiskTabLabel: 'Central Risk Committee',
  auditTabLabel: 'Central Committee For Audit And Governance',
  centralRiskMember1Name: 'DR. Ahmed Darwish',
  centralRiskMember1Title: 'Managing Director Funds & Portfolios Management',
  centralRiskMember1Image: '/board/ahmed-darwish.jpg',
  centralRiskMember2Name: 'MS. Rania Essam',
  centralRiskMember2Title: 'Board Members',
  centralRiskMember2Image: '/board/rania-essam.jpg',
  centralRiskMember3Name: 'MR. Mohamed Hassan',
  centralRiskMember3Title: 'Managing Director - Specialized Investment Funds',
  centralRiskMember3Image: '/board/mohamed-hassan.jpg',
  centralRiskMember4Name: 'DR. Ahmed Shehata',
  centralRiskMember4Title: 'Managing Director REITs & Private Equity Funds',
  centralRiskMember4Image: '/board/ahmed-shehata.jpg',
  centralRiskMember5Name: 'ENG. Heba Saad Zaghoul',
  centralRiskMember5Title: 'Board Members',
  centralRiskMember5Image: '/board/heba-zaghoul.jpg',
  centralRiskMember6Name: 'DR. Ashraf El-Araby',
  centralRiskMember6Title: 'Board Members',
  centralRiskMember6Image: '/board/ashraf-elaraby.jpg',
  auditMember1Name: 'DR. Ashraf El-Araby',
  auditMember1Title: 'Committee Chairman',
  auditMember1Image: '/board/ashraf-elaraby.jpg',
  auditMember2Name: 'ENG. Heba Saad Zaghoul',
  auditMember2Title: 'Board Members',
  auditMember2Image: '/board/heba-zaghoul.jpg',
  auditMember3Name: 'MS. Rania Essam',
  auditMember3Title: 'Board Members',
  auditMember3Image: '/board/rania-essam.jpg',
  auditMember4Name: 'DR. Ahmed Shehata',
  auditMember4Title: 'Managing Director REITs & Private Equity Funds',
  auditMember4Image: '/board/ahmed-shehata.jpg',
  auditMember5Name: 'DR. Ahmed Darwish',
  auditMember5Title: 'Managing Director Funds & Portfolios Management',
  auditMember5Image: '/board/ahmed-darwish.jpg',
  auditMember6Name: 'MR. Mohamed Hassan',
  auditMember6Title: 'Managing Director - Specialized Investment Funds',
  auditMember6Image: '/board/mohamed-hassan.jpg',
};

export default async function CommitteesSupportingBoardWrapper({ lang }: { lang: string }) {
  const committee = await getCommitteeContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  
  return <CommitteesSupportingBoard data={committee} BASE_URL={BASE_URL} lang={lang} />;
}
