import { HeroSectionWrapper, AboutSection, OurStorySection, WhyChooseUsSection, PartnersStripSection, BoardOfDirectorsSection } from '@/components/site-front/aboutpage';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
 const { locale: lang } = await params;
  return (
    <main className="min-h-full flex flex-col">
      <HeroSectionWrapper lang={lang} />
      <AboutSection lang={lang} />
      <OurStorySection lang={lang} />
      <WhyChooseUsSection />
      <PartnersStripSection />
      <BoardOfDirectorsSection  lang={lang}/>
    </main>
  );
}
