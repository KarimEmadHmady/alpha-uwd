'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection({ data, BASE_URL, lang }: { data: any; BASE_URL: string; lang: string }) {

  // Ensure data exists with fallbacks
  const safeData = data || {};
  const BULLETS = [
    safeData.bullet1 || 'The Acquisition Of Alpha Financial Investments By More Of Clients',
    safeData.bullet2 || 'Provides Liquidity Management Services To High-Net-Worth Institutions',
    safeData.bullet3 || 'Provides Family Portfolio Management Services'
  ];
  const STATS = [
    { value: safeData.stat1Value || '15', label: safeData.stat1Label || 'Bn Aums' },
    { value: safeData.stat2Value || '15+', label: safeData.stat2Label || 'Of Experience' },
    { value: safeData.stat3Value || '20+', label: safeData.stat3Label || 'Clients' },
  ];

return (
    <section className="py-20 bg-white dark:bg-[#1a1a1a]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — image with badge */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={safeData.teamImage?.startsWith('http') ? safeData.teamImage : (safeData.teamImage ? `${BASE_URL}/${safeData.teamImage}` : "/about-team.jpg")}
                alt="Alpha Team"
                fill
                className="object-cover"
              />
            </div>

            {/* 99% badge */}
            <div className="absolute bottom-6 -right-10 bg-white dark:bg-[#2a2a2a] border border-transparent dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-black/40 p-4 flex items-center gap-4 opacity-80">
              <div className="text-4xl font-black text-[#00437A]">99%</div>
              <div className="flex gap-1 items-end">
                {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className={i === 5 ? 'w-2.5 rounded-sm' : 'w-2.5 rounded-sm bg-gray-200 dark:bg-gray-600'}
                    style={{
                      height: `${h * 0.6}px`,
                      background: i === 5 ? '#00437A' : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400">
              {safeData.badgeText || 'About Us'}
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-50 leading-snug">
              {safeData.title || 'Reputable Asset Manager With An Impressive Track'}<br />
            </h2>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {safeData.description || 'Alpha Financial Investments Is One Of The Leading Companies In The Egyptian Market In The Field Of Investment Fund And Portfolio Management. The Company Began Its Operations In 2009 And Has Since Built A Solid Track Record Of Experience And Achievements In The Financial Services Sector.'}
            </p>

            <ul className="space-y-3">
              {BULLETS.map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-[#00437A] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="flex gap-10 pt-4 border-t border-gray-100 dark:border-gray-700">
              {STATS.map((s: any) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-[#00437A]">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}