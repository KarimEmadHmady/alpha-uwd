// src/app/[locale]/page.tsx
import { HeroSection, TrustedBySectionWrapper, AboutSection, InvestmentFundsSection, ServicesSection, CTASection, FAQSectionWrapper, BlogsSection } from '@/components/site-front/homapage';
import { useTranslations } from 'next-intl';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection lang={locale} />
      <TrustedBySectionWrapper lang={locale} />
      <AboutSection lang={locale} />
      <InvestmentFundsSection />
      <ServicesSection lang={locale} />
      <CTASection lang={locale} />
      <FAQSectionWrapper lang={locale} />
      <BlogsSection lang={locale} />
    </main>
  );
}
