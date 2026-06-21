'use client';

import Image from 'next/image';

const PARTNERS = [
  { name: 'ODIN',      src: '/partners/odin.png' },
  { name: 'Certus',    src: '/partners/certus.png' },
  { name: 'EgyTrox',   src: '/partners/egytrox.png' },
  { name: 'GreenCap',  src: '/partners/greencap.png' },
  { name: 'FinGuard',  src: '/partners/finguard.png' },
  { name: 'VoltFund',  src: '/partners/voltfund.png' },
//   { name: 'AlphaX',    src: '/partners/alphax.png' },
];

export default function TrustedBySection() {
  return (
    <section className="py-12 " dir="ltr">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-gray-400 font-medium mb-8 tracking-wide uppercase">
          Trusted By 15,000 Founders &amp; Business Owners
        </p>

        {/* Scrolling logos */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="flex-shrink-0 h-20 w-40 relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <Image src={p.src} alt={p.name} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </section>
  );
}