'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface HeroSectionProps {
  lang?: string;
}

const translations = {
  en: {
    badge: "Apply Now",
    title: "Start Your Journey With Us",
  },
  ar: {
    badge: "قدم الآن",
    title: "ابدأ رحلتك معنا",
  },
};

export default function HeroSection({ lang = "en" }: HeroSectionProps) {
  const isArabic = lang === "ar";
  const t = translations[lang as keyof typeof translations] || translations.en;
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
    <section className="relative h-auto p-3 overflow-hidden bg-[#F2F2F2] dark:bg-[#1a1a1a]" dir={isArabic ? "rtl" : "ltr"}>
      {/* Background pattern image */}
      <Image
        src="/Group 5.png"
        alt="Background Pattern"
        fill
        className="object-cover opacity-90 dark:opacity-20 absolute inset-0 z-0"
      />

      <div className="max-w-7xl mx-auto px-6 py-6 pb-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[420px]">
          {/* Left */}
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#00437A]"></span>
              {t.badge}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-50 leading-tight">
              {t.title}
            </h1>

            {/* Stars + avatars */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <Image src={`/avatars/avatar-${i}.jpg`} alt="" width={36} height={36} className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isArabic ? "من" : "From"} <span ref={el => { counterRefs.current[3] = el; }}>0+</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right — hero image + floating cards */}
          <div className="relative h-[360px] lg:h-[280px]">
            {/* Floating top-left counter */}
            <div className={`absolute top-4 ${isArabic ? "right-0" : "left-0"} z-10 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg px-5 py-3 text-center`}>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                <span ref={el => { counterRefs.current[0] = el; }}>0</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{isArabic ? "المتقدمون" : "Total Users"}</p>
            </div>

            {/* Main image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md mx-auto">
                <Image
                  src="/herosec-careers.png"
                  alt="Financial Advisor"
                  fill
                  className="object-contain object-center drop-shadow-xl"
                  priority
                />
                {/* Blue circle bg */}
                <div className="absolute inset-[10%] rounded-full bg-[#e8f1f8] dark:bg-[#00437A]/10 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
