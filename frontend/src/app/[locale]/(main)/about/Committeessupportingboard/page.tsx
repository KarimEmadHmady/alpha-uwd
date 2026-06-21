import { MemberCard , HeroSection } from '@/components/site-front/aboutpage/Committeessupportingboard/index';
import { useTranslations } from 'next-intl';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> })  {
     const { locale: lang } = await params;

  // const t = useTranslations('about');

  return (
    <main className="min-h-full flex flex-col">
      <HeroSection lang={lang} />
      <MemberCard lang={lang} />
    </main>
  );
}
