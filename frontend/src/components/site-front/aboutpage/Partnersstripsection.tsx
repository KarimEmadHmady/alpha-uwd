'use client';

import Image from 'next/image';

const PARTNERS = [
  { name: 'ODIN',      src: '/partners/odin.png' },
  { name: 'Certus',    src: '/partners/certus.png' },
  { name: 'EgyTrox',   src: '/partners/egytrox.png' },
  { name: 'GreenCap',  src: '/partners/greencap.png' },
  { name: 'FinGuard',  src: '/partners/finguard.png' },
  { name: 'VoltFund',  src: '/partners/voltfund.png' },
];

export default function TrustedBySection() {
  return (
    <section className="py-12" dir="ltr">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xl text-gray-400 font-medium mb-8 tracking-wide uppercase">
          Trusted By 15,000 Founders &amp; Business Owners
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