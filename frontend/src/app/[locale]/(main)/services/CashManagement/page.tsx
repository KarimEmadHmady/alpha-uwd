import { HeroSection, CashManagementCard } from '@/components/site-front/servicespage/CashManagement/index';

export default async   function CashManagement({ params }: { params: Promise<{ locale: string }> })  {
const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang}  />
      <CashManagementCard lang={lang} />
    </main>
  );
}