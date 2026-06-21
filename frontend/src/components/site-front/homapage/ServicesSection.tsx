import Image from 'next/image';
import Link from 'next/link';

async function getServicesContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/home?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const services = data.content?.services ?? null;
    
    if (!services) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(services)) {
      if (key.startsWith('service') && key.endsWith('Image')) {
        // Image fields are strings, not multilingual
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
  badgeText: 'Services',
  subtitle: 'We Offer A Wide Range Of Services To Support You In The Best Possible Way',
  service1Title: 'Funds Management',
  service1Desc: 'We Manage A Diverse Range Of Investment Funds Tailored To Your Goals.',
  service2Title: 'Portfolio Management',
  service2Desc: 'One Of The Leading Companies In Portfolio Advisory Services.',
  service3Title: 'Cash Management',
  service3Desc: 'Alpha Financial Investments Helps You Optimise Cash Flow.',
  service4Title: 'Private Pension Funds',
  service4Desc: 'Specializes In Managing Private Pension Funds And Retirement Planning.',
  service5Title: 'Managing Family Business',
  service5Desc: 'Provides Family Portfolio Management Services.',
  service1Image: '',
  service2Image: '',
  service3Image: '',
  service4Image: '',
  service5Image: '',
};

export default async function ServicesSection({ lang }: { lang: string }) {
  const services = await getServicesContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  const SERVICES = [
    {
      img: services.service1Image?.startsWith('http') ? services.service1Image : (services.service1Image ? `${BASE_URL}/${services.service1Image}` : "/services/funds-management.jpg"),
      title: services.service1Title,
      desc: services.service1Desc,
    },
    {
      img: services.service2Image?.startsWith('http') ? services.service2Image : (services.service2Image ? `${BASE_URL}/${services.service2Image}` : "/services/portfolio-management.jpg"),
      title: services.service2Title,
      desc: services.service2Desc,
    },
    {
      img: services.service3Image?.startsWith('http') ? services.service3Image : (services.service3Image ? `${BASE_URL}/${services.service3Image}` : "/services/cash-management.jpg"),
      title: services.service3Title,
      desc: services.service3Desc,
    },
    {
      img: services.service4Image?.startsWith('http') ? services.service4Image : (services.service4Image ? `${BASE_URL}/${services.service4Image}` : "/services/pension-funds.jpg"),
      title: services.service4Title,
      desc: services.service4Desc,
    },
    {
      img: services.service5Image?.startsWith('http') ? services.service5Image : (services.service5Image ? `${BASE_URL}/${services.service5Image}` : "/services/family-business.jpg"),
      title: services.service5Title,
      desc: services.service5Desc,
    },
  ];

  return (
    <section className="py-20 " dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-sm  mb-3  text-gray-800 dark:text-gray-200">
            {services.badgeText}
          </div>
          <p className=" text-sm text-gray-800 dark:text-gray-50 ">
            {services.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {SERVICES.map((s, i) => (
            <Link key={i} href="#" className="group block">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-3">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <h3 className="font-bold  text-sm group-hover:text-[#00437A] transition-colors text-gray-800 dark:text-gray-200">
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}