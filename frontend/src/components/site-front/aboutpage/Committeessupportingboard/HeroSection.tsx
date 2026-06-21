'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function HeroSection({ data, BASE_URL, lang }: { data: any; BASE_URL: string; lang: string }) {
  // Ensure data exists with fallbacks
  const safeData = data || {};
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const counters = [
      { el: counterRefs.current[0], target: 200000, prefix: '+', suffix: '' },
      { el: counterRefs.current[1], target: 50,     prefix: '',  suffix: 'M' },
      { el: counterRefs.current[2], target: 200000, prefix: '+', suffix: '' },
      { el: counterRefs.current[3], target: 600,    prefix: '',  suffix: '+' },
    ];
    counters.forEach(({ el, target, prefix, suffix }) => {
      if (!el) return;
      let start = 0;
      const duration = 1800;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(timer); }
        el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
      }, 16);
    });
  }, []);

return (
    
    <section className="relative h-auto p-3 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Background pattern image */}
      <Image
        src={safeData.backgroundImage?.startsWith('http') ? safeData.backgroundImage : (safeData.backgroundImage ? `${BASE_URL}/${safeData.backgroundImage}` : "/Group 5.png")}
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
              {safeData.badgeText || 'Welcome To Alpha Asset Management'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-50 leading-tight">
              {safeData.title || 'Committees Supporting The Board'}<br />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-md leading-relaxed">
              {safeData.subtitle || 'Expert committees dedicated to governance and risk management'}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-6 flex-wrap">
              <Link
                href={safeData.ctaLink || '#'}
                className="flex items-center gap-2 bg-[#00437A] hover:bg-[#003060] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors shadow-md"
              >
                {safeData.ctaText || "Let's Talk"}
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
                <p className="text-xs text-gray-500 dark:text-gray-400">{safeData.trustLabel || 'From'} <span ref={el => { counterRefs.current[3] = el; }}>0+</span></p>
              </div>
            </div>
          </div>

          {/* Right — hero image + floating cards */}
          <div className="relative h-[360px] lg:h-[280px]">
            {/* Floating top-left counter */}
            <div className="absolute top-4 left-0 z-10 bg-white dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg dark:shadow-black/40 px-5 py-3 text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                <span ref={el => { counterRefs.current[0] = el; }}>0</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{safeData.totalUsersLabel || 'Total Users'}</p>
            </div>

            {/* Main image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md mx-auto">
                <Image
                  src={safeData.heroImage?.startsWith('http') ? safeData.heroImage : (safeData.heroImage ? `${BASE_URL}/${safeData.heroImage}` : "/hero-person-about.png")}
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