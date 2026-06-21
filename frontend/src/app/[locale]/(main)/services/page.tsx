import { HeroSection, FinancialServicesGrid } from '@/components/site-front/servicespage/index';

export default async   function servicesPage({ params }: { params: Promise<{ locale: string }> })  {
const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang}  />
      <FinancialServicesGrid lang={lang} />
    </main>
  );
}
