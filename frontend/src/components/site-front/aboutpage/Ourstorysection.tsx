'use client';

import Link from 'next/link';

const TIMELINE = [
  {
    year: '2009',
    title: 'Establishment Of The Company',
    desc: '',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    year: '2016',
    title: 'Awarded The Management Of The Egyptian Land Bank Fund',
    desc: '',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    year: '2021',
    title: 'The Acquisition Of Alpha Financial Investments By Odin Investments',
    desc: 'Management Of Al Masreyeen Real Estate Fund, Odin Kasb Fund, And Delta Life Insurance Fund.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    year: '2024',
    title: 'OZ Fixed Income Investment Fund (First USD Issuance)',
    desc: '',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    year: '2025',
    title: 'OZ Investment Fund (Second Euro Issuance)',
    desc: 'Odin Money Market Fund (Odin IV), And Odin Equity Investment Fund (Trend – First Issuance).',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function OurStorySection({ lang }: { lang: string }) {
return (
    <section className="py-20 bg-white dark:bg-[#1a1a1a]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5">
              Our Story
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-50 leading-snug">
              Shaping A Future Of<br />
              Intelligent Finance
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
              Alpha Financial Investments Has Been Managing Diverse Investment
              Funds Since Obtaining Its FRA License In 2016.
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
              With A Clear Vision And An Experienced Team, The Company Delivers
              Professional Fund Management.
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
              It Focuses On Sustainable Returns And Reinforcing Its Position As A
              Trusted Financial Partner.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-[#00437A] hover:bg-[#003060] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              Let&apos;s Talk
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right — vertical timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-0">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative flex gap-6 pb-10 last:pb-0 group">
                  {/* Icon dot */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-[#2a2a2a] border-2 border-gray-200 dark:border-gray-700 group-hover:border-[#00437A] dark:group-hover:border-[#00437A] transition-colors flex items-center justify-center z-10 text-gray-400 dark:text-gray-500 group-hover:text-[#00437A] dark:group-hover:text-[#00437A]">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div className="pt-1.5 min-w-0">
                    <span className="text-[#00437A] font-bold text-base">{item.year}</span>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm mt-1 leading-snug">{item.title}</p>
                    {item.desc && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}