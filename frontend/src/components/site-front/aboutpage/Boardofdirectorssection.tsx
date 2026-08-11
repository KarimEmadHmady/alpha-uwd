'use client';

import Image from 'next/image';

interface BoardOfDirectorsSectionProps {
  data?: any;
  BASE_URL?: string;
  lang?: string;
}

export default function BoardOfDirectorsSection({ data, BASE_URL, lang }: BoardOfDirectorsSectionProps) {
  const safeData = data || {};
  const safeLang = lang || 'en';

  const BOARD = [
    {
      img: safeData.member1Image?.startsWith('http') ? safeData.member1Image : (safeData.member1Image ? `${BASE_URL}/${safeData.member1Image}` : '/board/ahmed-darwish.jpg'),
      name: safeData.member1Name || 'DR. Ahmed Darwish',
      title: safeData.member1Title || 'Managing Director Funds & Portfolios Management',
    },
    {
      img: safeData.member2Image?.startsWith('http') ? safeData.member2Image : (safeData.member2Image ? `${BASE_URL}/${safeData.member2Image}` : '/board/rania-essam.jpg'),
      name: safeData.member2Name || 'MS. Rania Essam',
      title: safeData.member2Title || 'Board Members',
    },
    {
      img: safeData.member3Image?.startsWith('http') ? safeData.member3Image : (safeData.member3Image ? `${BASE_URL}/${safeData.member3Image}` : '/board/mohamed-hassan.jpg'),
      name: safeData.member3Name || 'MR. Mohamed Hassan',
      title: safeData.member3Title || 'Managing Director - Specialized Investment Funds',
    },
    {
      img: safeData.member4Image?.startsWith('http') ? safeData.member4Image : (safeData.member4Image ? `${BASE_URL}/${safeData.member4Image}` : '/board/ahmed-shehata.jpg'),
      name: safeData.member4Name || 'DR. Ahmed Shehata',
      title: safeData.member4Title || 'Managing Director REITs & Private Equity Funds',
    },
    {
      img: safeData.member5Image?.startsWith('http') ? safeData.member5Image : (safeData.member5Image ? `${BASE_URL}/${safeData.member5Image}` : '/board/heba-zaghoul.jpg'),
      name: safeData.member5Name || 'ENG. Heba Saad Zaghoul',
      title: safeData.member5Title || 'Board Members',
    },
    {
      img: safeData.member6Image?.startsWith('http') ? safeData.member6Image : (safeData.member6Image ? `${BASE_URL}/${safeData.member6Image}` : '/board/ashraf-elaraby.jpg'),
      name: safeData.member6Name || 'DR. Ashraf El-Araby',
      title: safeData.member6Title || 'Board Members',
    },
  ];
return (
    <section className="py-20 bg-white dark:bg-[#1a1a1a]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 border border-[#00437A] dark:border-gray-700 rounded-full px-5 py-2 text-xl text-gray-600 dark:text-gray-400  bg-white dark:bg-gray-800 shadow-lg bg-gray-50 dark:bg-white/5">
            {safeData.badgeText || 'Board Of Director'}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOARD.map((member, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-[#2a2a2a] border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg dark:hover:shadow-black/40 transition-shadow duration-300"
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="p-5">
              <div className='flex items-center justify-between'>
                <h3 className="font-bold text-gray-800 dark:text-gray-50 text-base group-hover:text-[#00437A] dark:group-hover:text-[#00437A] transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs text-gray-300 dark:text-gray-600">#{String(i + 1).padStart(2, '0')}</span>
              </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">{member.title}</p>

                {/* Divider + social placeholder */}
                {/* <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                   <div className="flex gap-2">
                    <a
                      href="#"
                      className="w-7 h-7 rounded-full border border-[#00437A] dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-[#00437A] hover:text-[#00437A] dark:hover:border-[#00437A] dark:hover:text-[#00437A] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-7 h-7 rounded-full border border-[#00437A] dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-[#00437A] hover:text-[#00437A] dark:hover:border-[#00437A] dark:hover:text-[#00437A] transition-colors"
                      aria-label="Email"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div> 
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}