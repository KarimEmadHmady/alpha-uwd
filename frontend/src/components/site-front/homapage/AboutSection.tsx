import Image from 'next/image';

async function getAboutContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/home?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const about = data.content?.about ?? null;
    
    if (!about) return null;
    
    // Extract multilingual content and handle sectionImage
    const result: any = {};
    
    for (const [key, value] of Object.entries(about)) {
      if (key === 'sectionImage') {
        // sectionImage is a string, not multilingual
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

const FALLBACK = {
  badgeText:   'About Us',
  title:       'Reputable Asset Manager With An Impressive Track',
  description: 'Alpha Financial Investments Is One Of The Leading Companies...',
  bullet1:     'The Acquisition Of Alpha Financial Investments By More Of Clients',
  bullet2:     'Provides Liquidity Management Services To High-Net-Worth Institutions',
  bullet3:     'Provides Family Portfolio Management Services',
  stat1Value:  '15',
  stat1Label:  'Bn Aums',
  stat2Value:  '15+',
  stat2Label:  'Of Experience',
  stat3Value:  '20+',
  stat3Label:  'Clients',
  sectionImage: '',
};

export default async function AboutSection({ lang }: { lang: string }) {
  const about = await getAboutContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  const bullets = [about.bullet1, about.bullet2, about.bullet3];
  const stats   = [
    { value: about.stat1Value, label: about.stat1Label },
    { value: about.stat2Value, label: about.stat2Label },
    { value: about.stat3Value, label: about.stat3Label },
  ];

  return (
    <section className="py-20 " dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image src={about.sectionImage?.startsWith('http') ? about.sectionImage : (about.sectionImage ? `${BASE_URL}/${about.sectionImage}` : "/about-team.jpg")} alt="Alpha Team" fill className="object-cover" />
            </div>
            <div className="absolute bottom-6 -right-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 flex items-center gap-4 opacity-80">
              <div className="text-4xl font-black text-[#00437A]">99%</div>
              <div className="flex gap-1 items-end">
                {[40,65,50,80,55,90,70].map((h, i) => (
                  <div key={i} className="w-2.5 rounded-sm"
                    style={{ height: `${h*0.6}px`, background: i===5 ? '#00437A' : '#e2eaf3' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div className="space-y-6">
            <div className="inline-flex text-gray-800 dark:text-gray-50 items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-sm ">
              {about.badgeText}
            </div>

            <h2 className="text-3xl text-gray-800 dark:text-gray-50 lg:text-4xl font-bold  leading-snug">
              {about.title}
            </h2>

            <p className="leading-relaxed text-gray-800 dark:text-gray-50">
              {about.description}
            </p>

            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-800 dark:text-gray-50">
                  <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-[#00437A] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex gap-10 pt-4 border-t border-gray-100">
              {stats.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-[#00437A]">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}