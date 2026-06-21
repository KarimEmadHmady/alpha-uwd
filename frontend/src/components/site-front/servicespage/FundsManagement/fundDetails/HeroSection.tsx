'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { pageContentService } from '@/services/pageContentService';

interface HeroContent {
  badgeText?: { ar?: string; en?: string } | string;
  title?: { ar?: string; en?: string } | string;
  subtitle?: { ar?: string; en?: string } | string;
  ctaText?: { ar?: string; en?: string } | string;
  ctaLink?: { ar?: string; en?: string } | string;
  totalUsersLabel?: { ar?: string; en?: string } | string;
  trustLabel?: { ar?: string; en?: string } | string;
  backgroundImage?: string;
  heroImage?: string;
}

export default function HeroSection() {
  const locale = useLocale();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get translated text
  const getText = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      return field[locale] || field.ar || field.en || '';
    }
    return '';
  };

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const response = await pageContentService.getPageContent('fundHero');
        if (response && response.content && response.content.hero) {
          setHeroContent(response.content.hero);
        }
      } catch (error) {
        console.error('Failed to load hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

return (
    
    <section className="relative h-auto p-3 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Background pattern image */}
      <Image
        src={heroContent?.backgroundImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${heroContent.backgroundImage}` : "/Group 5.png"}
        alt="Background Pattern"
        fill
        className="object-cover opacity-90 dark:opacity-30 absolute inset-0 z-0"
      />
      
      {/* Top badge */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[420px]">

          {/* Left */}
          <div className="space-y-6 relative z-10 ">
            <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 mb-8 bg-white/60 dark:bg-white/5">
              <span className="w-2 h-2 rounded-full bg-[#00437A]"></span>
              {getText(heroContent?.badgeText) || 'Services'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-50 leading-tight">
              {getText(heroContent?.title) || 'Egyptians Real Estate Fund'}<br />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-md leading-relaxed">
              {getText(heroContent?.subtitle) || 'Al-Masreyin Real Estate Investment Fund'}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-6 flex-wrap">
              <Link
                href={getText(heroContent?.ctaLink) || '#'}
                className="flex items-center gap-2 bg-[#00437A] hover:bg-[#003060] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors shadow-md"
              >
                {getText(heroContent?.ctaText) || "Let's Talk"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Stars + avatars */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <Image src={`/avatars/avatar-${i}.jpg`} alt="" width={36} height={36} className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getText(heroContent?.trustLabel) || 'From'} <span>0+</span></p>
              </div>
            </div>
          </div>

          {/* Right — hero image + floating cards */}
          <div className="relative h-[360px] lg:h-[280px]">
            {/* Main image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md mx-auto">
                <Image
                  src={heroContent?.heroImage ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${heroContent.heroImage}` : "/Group6.png"}
                  alt="Financial Advisor"
                  fill
                  className="object-contain object-center drop-shadow-xl"
                  priority
                />
                {/* Blue circle bg */}
                <div className="absolute inset-[10%] rounded-full bg-[#e8f1f8] dark:bg-[#00437A]/20 -z-10" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}