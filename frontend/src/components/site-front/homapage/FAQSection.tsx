'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Props {
  faqs: { q: string; a: string }[];
  content: any;
  lang: string;
}

export default function FAQSection({ faqs, content, lang }: Props) {
  const [openIdx, setOpenIdx] = useState<number>(2);

  return (
    <section className="py-20 bg-gray-100 dark:bg-[#222] " dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200 ">
              {content.badgeText}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-snug text-gray-800 dark:text-gray-200">
              {content.title}<br />
              {content.subtitle}
            </h2>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-[#00437A] hover:bg-[#003060] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              {content.buttonText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i: number) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={i}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    isOpen ? 'border-[#00437A]/30 bg-[#00437A]/3' : 'border-gray-100 bg-white dark:bg-gray-500 dark:border-gray-800'
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className={`text-sm font-semibold ${isOpen ? 'text-[#00437A]' : 'text-gray-800 dark:text-gray-200'}`}>
                      {faq.q}
                    </span>
                    <span className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-[#00437A] text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                      <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}