import { HeroSection, PortfolioManagementCardWrapper } from '@/components/site-front/servicespage/PortfolioManagement/index';

export default async   function PortfolioManagement({ params }: { params: Promise<{ locale: string }> })  {
const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang}  />
      <PortfolioManagementCardWrapper lang={lang} />
    </main>
  );
}