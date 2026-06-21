// components/HeroSection.tsx
import Image from 'next/image';
import Link from 'next/link';
import HeroStats from './HeroStats';

// Server-side fetch — بيتنفذ على السيرفر مش في البراوزر
async function getHeroContent(lang: string) {
  try {
    // استخدم query parameter بدل header — أضمن
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/home?lang=all`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const hero = data.content?.hero ?? null;
    
    if (!hero) return null;
    
    // Extract multilingual content and handle backgroundImage
    const result: any = {};
    
    for (const [key, value] of Object.entries(hero)) {
      if (key === 'backgroundImage') {
        // backgroundImage is a string, not multilingual
        result[key] = value;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Extract language-specific content for multilingual fields
        const multilingualValue = value as { ar?: string; en?: string; [key: string]: string | undefined };
        result[key] = multilingualValue[lang] || multilingualValue.ar || multilingualValue.en || '';
      } else {
        result[key] = value;
      }
    }
    
    return result;
  } catch {
    return null;
  }
}

// Fallback لو الـ API فضى أو فيه error
const FALLBACK = {
  badgeText:            'Welcome To Alpha Asset Management',
  title:                'Build A Smarter Financial Future With Alpha Asset Management',
  subtitle:             'Empowering Individuals And Businesses With Expert Financial Planning, Investment Strategies, And Data-Driven Insights.',
  buttonText:           "Let's Talk",
  totalUsersLabel:      'Total Users',
  activeUsersLabel:     'Active Users',
  activeUsersSubLabel:  'Growth Last Month',
  satisfiedClientsLabel:'Satisfied Clients',
  reviewsLabel:         'Happy Clients',
  backgroundImage:       '',
};

export default async function HeroSection({ lang }: { lang: string }) {
  const hero = await getHeroContent(lang) ?? FALLBACK;

  // الـ counters محتاجين client-side عشان الـ animation
  // فهنعزلهم في component منفصل
  return (
    <section className="relative overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-0">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border text-gray-500 dark:text-gray-400 border-gray-200 rounded-full px-4 py-1.5 text-sm  ">
          <span className="w-2 h-2 rounded-full bg-[#00437A]"></span>
          {hero.badgeText}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[520px]">
          {/* Left */}
          <div className="space-y-6 relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-400">
              {hero.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-md leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <Link
                href="#"
                className="flex items-center gap-2 bg-[#00437A] hover:bg-[#003060] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors shadow-md"
              >
                {hero.buttonText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right — الـ counters في Client Component منفصل */}
          <HeroStats
            totalUsersLabel={hero.totalUsersLabel}
            activeUsersLabel={hero.activeUsersLabel}
            activeUsersSubLabel={hero.activeUsersSubLabel}
            satisfiedClientsLabel={hero.satisfiedClientsLabel}
            reviewsLabel={hero.reviewsLabel}
            backgroundImage={hero.backgroundImage}
          />
        </div>
      </div>
    </section>
  );
}




