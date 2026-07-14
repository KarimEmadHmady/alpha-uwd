'use client';

import Image from 'next/image';

interface PartnersStripSectionProps {
  data?: any;
  BASE_URL?: string;
  lang?: string;
}

export default function TrustedBySection({ data, BASE_URL, lang }: PartnersStripSectionProps) {
  const safeData = data || {};

  const PARTNERS = [
    { name: 'ODIN',      src: safeData.partner1Logo?.startsWith('http') ? safeData.partner1Logo : (safeData.partner1Logo ? `${BASE_URL}/${safeData.partner1Logo}` : '/partners/odin.png') },
    { name: 'Certus',    src: safeData.partner2Logo?.startsWith('http') ? safeData.partner2Logo : (safeData.partner2Logo ? `${BASE_URL}/${safeData.partner2Logo}` : '/partners/certus.png') },
    { name: 'EgyTrox',   src: safeData.partner3Logo?.startsWith('http') ? safeData.partner3Logo : (safeData.partner3Logo ? `${BASE_URL}/${safeData.partner3Logo}` : '/partners/egytrox.png') },
    { name: 'GreenCap',  src: safeData.partner4Logo?.startsWith('http') ? safeData.partner4Logo : (safeData.partner4Logo ? `${BASE_URL}/${safeData.partner4Logo}` : '/partners/greencap.png') },
    { name: 'FinGuard',  src: safeData.partner5Logo?.startsWith('http') ? safeData.partner5Logo : (safeData.partner5Logo ? `${BASE_URL}/${safeData.partner5Logo}` : '/partners/finguard.png') },
    { name: 'VoltFund',  src: safeData.partner6Logo?.startsWith('http') ? safeData.partner6Logo : (safeData.partner6Logo ? `${BASE_URL}/${safeData.partner6Logo}` : '/partners/voltfund.png') },
  ];
  return (
    <section className="py-12" dir="ltr">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xl text-gray-400 font-medium mb-8 tracking-wide uppercase">
          {safeData.title || 'Trusted By 15,000 Founders & Business Owners'}
        </p>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="tile flex-shrink-0 flex items-center justify-center transition-all opacity-60 hover:opacity-100">
                <div className="img-box relative">
                  <Image src={p.src} alt={p.name} fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --tile-w: 160px;
          --tile-h: 128px;
          --img-large: 96px;
          --img-small: 56px;
        }
        @media (max-width: 640px) {
          :root {
            --tile-w: 120px;
            --tile-h: 96px;
            --img-large: 72px;
            --img-small: 44px;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          :root {
            --tile-w: 140px;
            --tile-h: 112px;
            --img-large: 84px;
            --img-small: 50px;
          }
        }
      `}</style>

      <style jsx>{`
        .tile {
          width: var(--tile-w);
          height: var(--tile-h);
        }
        .img-box {
          width: var(--img-large);
          height: var(--img-large);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </section>
  );
}