import CareerPage from "@/components/site-front/careerspage/CareerPage";

export default async function CareerPageComponent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">
      <CareerPage lang={lang} />
    </main>
  );
}
