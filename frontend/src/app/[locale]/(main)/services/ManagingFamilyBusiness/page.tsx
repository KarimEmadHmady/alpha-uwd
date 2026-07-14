import { HeroSection, FamilyBusinessPortfoliosCard } from '@/components/site-front/servicespage/ManagingFamilyBusiness/index';

export default async   function ManagingFamilyBusiness({ params }: { params: Promise<{ locale: string }> })  {
const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang}  />
      <FamilyBusinessPortfoliosCard lang={lang} />
    </main>
  );
}