import { ContactSection , HeroSection } from "@/components/site-front/contactpage";

export default async function ContactPageComponent({ params }: { params: Promise<{ locale: string }> }) {
 const { locale: lang } = await params;

  return (
    <main className="min-h-full flex flex-col">

      <HeroSection  lang={lang}  />;
      <ContactSection   lang={lang} />;
    </main>
  );
}
