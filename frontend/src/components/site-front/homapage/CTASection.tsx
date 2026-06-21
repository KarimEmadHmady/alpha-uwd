import Image from 'next/image';
import Link from 'next/link';

async function getCTAContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/home?lang=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const cta = data.content?.cta ?? null;
    
    if (!cta) return null;
    
    // Extract multilingual content and handle images
    const result: any = {};
    
    for (const [key, value] of Object.entries(cta)) {
      if (key.endsWith('Image')) {
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
  title: 'Secure Your Financial Future',
  subtitle: 'Trusted By Thousands Who\'ve Built Smarter, More Secure Financial Futures With Alpha',
  buttonText: 'See More',
  backgroundImage: '',
  leftDecorationImage: '',
  rightImage: '',
};

export default async function CTASection({ lang }: { lang: string }) {
  const cta = await getCTAContent(lang) ?? FALLBACK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  return (
    <section className="py-16 " dir="ltr">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-[#00437A] rounded-3xl overflow-visible min-h-[320px] flex items-center">
          {/* Background pattern image */}
          <Image
            src={cta.backgroundImage?.startsWith('http') ? cta.backgroundImage : (cta.backgroundImage ? `${BASE_URL}/${cta.backgroundImage}` : "/Group 5.png")}
            alt="Background Pattern"
            fill
            className="object-cover opacity-30"
          />
          
          {/* Left side image */}
          <div className="absolute left-0 top-0 w-full h-full z-10 pointer-events-none">
            <Image
              src={cta.leftDecorationImage?.startsWith('http') ? cta.leftDecorationImage : (cta.leftDecorationImage ? `${BASE_URL}/${cta.leftDecorationImage}` : "/Mask-group.png")}
              alt="Left Decoration"
              fill
              className="object-contain object-left"
            />
          </div>

          {/* Left text */}
          <div className="relative z-10 px-12 py-10 max-w-lg">
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-snug mb-4">
              {cta.title}<br />
            </h2>
            <p className="text-blue-200 text-sm mb-6">
              {cta.subtitle}
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-white font-semibold px-3 py-2 rounded-full hover:bg-blue-50 hover:text-[#00437A] transition-colors text-sm shadow-md border border-white"
            >
              {cta.buttonText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right image */}
          <div className="absolute right-0 -top-10 bottom-0 h-[calc(100%+40px)] w-1/2 hidden lg:block rounded-3xl overflow-hidden">
            <Image
              src={cta.rightImage?.startsWith('http') ? cta.rightImage : (cta.rightImage ? `${BASE_URL}/${cta.rightImage}` : "/cta-team.jpg")}
              alt="Financial Team"
              fill
              className="object-cover object-left"
            />
            {/* blend overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00437A] via-[#00437A]/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}