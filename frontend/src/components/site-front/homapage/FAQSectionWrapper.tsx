import FAQSection from './FAQSection';

async function getFAQContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/home?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const faq = data.content?.faq ?? null;
    
    if (!faq) return null;
    
    // Extract multilingual content
    const result: any = {};
    
    for (const [key, value] of Object.entries(faq)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
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
  badgeText: 'FAQ',
  title: 'Have More Questions?',
  subtitle: 'Let\'s Clear Them Up.',
  buttonText: 'Let\'s Talk',
  faq1Question: '01 How Can I Open An Account With Alpha Asset Management',
  faq1Answer: 'You can open an account by visiting our offices or through our online portal. Our team will guide you through the KYC process and help you choose the right investment product.',
  faq2Question: '02 Is Online Banking With Alpha Asset Management Secure?',
  faq2Answer: 'Yes, we use bank-grade encryption and multi-factor authentication to ensure your data and transactions are fully protected at all times.',
  faq3Question: '03 Can I Manage My Accounts From My Mobile Phone?',
  faq3Answer: 'Absolutely. Our mobile app is available on iOS and Android and allows you to monitor your portfolio, transfer funds, and contact support 24/7.',
  faq4Question: 'How Can We Help You?',
  faq4Answer: 'Our dedicated support team is ready to assist you with any questions about investment products, account management, and financial planning services.',
};

export default async function FAQSectionWrapper({ lang }: { lang: string }) {
  const faq = await getFAQContent(lang) ?? FALLBACK;

  const FAQS = [
    {
      q: faq.faq1Question,
      a: faq.faq1Answer,
    },
    {
      q: faq.faq2Question,
      a: faq.faq2Answer,
    },
    {
      q: faq.faq3Question,
      a: faq.faq3Answer,
    },
    {
      q: faq.faq4Question,
      a: faq.faq4Answer,
    },
  ];

  return <FAQSection faqs={FAQS} content={faq} lang={lang} />;
}
