import { HeroSection, PrivatePensionFundsCard } from '@/components/site-front/servicespage/PrivatePensionFunds/index';

export default async   function PrivatePensionFunds({ params }: { params: Promise<{ locale: string }> })  {
const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang}  />
      <PrivatePensionFundsCard lang={lang} />
    </main>
  );
}