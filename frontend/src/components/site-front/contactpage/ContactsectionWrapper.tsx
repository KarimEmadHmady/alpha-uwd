import ContactSection from './Contactsection';

async function getContactContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/contact?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const contactSection = data.content?.contactSection ?? null;
    
    if (!contactSection) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(contactSection)) {
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
  title: 'Get In Touch',
  subtitle: 'At Alpha Asset Management, We Provide The Tools, Insights, And Personalised Strategies You Need To Make Informed Financial',
  phoneNumber: '01121622277 – 0235380104 – 0235380105',
  address: 'Smart Village, Building Emerald Business Center No. 2210 B, Giza, Egypt',
  email: 'Alpha Asset Management',
  socialNetworkLabel: 'Social Network',
  formTitle: 'Connect With Our Team',
  formSubtitle: 'Have Questions Or Need Personalized Financial Guidance? Fill Out The Form Below To Connect With Alpha Asset Management\'s Expert',
  formNamePlaceholder: 'Your Name',
  formEmailPlaceholder: 'E-Mail',
  formPhonePlaceholder: 'Phone Number',
  formCompanyPlaceholder: 'Company Name',
  formMessagePlaceholder: 'Message...',
  formButtonText: 'Send',
  popupTitle: 'Thank You!',
  popupMessage1: 'We Appreciate That You\'ve Taken The Time To Write Us.',
  popupMessage2: 'We\'ll Get Back To You Very Soon',
  popupButtonText: 'Back To Home',
};

export default async function ContactSectionWrapper({ lang }: { lang: string }) {
  const contactSection = await getContactContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  
  return <ContactSection data={contactSection} BASE_URL={BASE_URL}  lang={lang}/>;
}
