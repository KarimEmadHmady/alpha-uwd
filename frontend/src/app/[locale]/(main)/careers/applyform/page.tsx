import { ApplyNow , HeroSection } from "@/components/site-front/careerspage/careersForm";

export default async function CareerFormPageComponent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang} />
      <ApplyNow lang={lang} />
    </main>
  );
}
