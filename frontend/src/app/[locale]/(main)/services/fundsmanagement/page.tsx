import { HeroSection, ServiceDescription, FundsGrid } from '@/components/site-front/servicespage/FundsManagement/index';

export default async   function servicesPage({ params }: { params: Promise<{ locale: string }> })  {
const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang} />
      <ServiceDescription lang={lang} />
      <FundsGrid lang={lang} />
    </main>
  );
}
