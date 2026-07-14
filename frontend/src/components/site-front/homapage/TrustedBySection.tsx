'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Partner {
  name: string;
  src: string;
  size?: 'large' | 'small';
}

interface Props {
  partners: Partner[];
}

export default function TrustedBySection({ partners }: Props) {
  const t = useTranslations('TrustedBySection');

  return (
    <section className="py-12" dir="ltr">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xl font-medium mb-8 tracking-wide uppercase">
          {t('trustedBy')}
        </p>

        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className="tile flex-shrink-0 flex items-center justify-center transition-all opacity-60 hover:opacity-100"
              >
                <div className={`relative ${p.size === 'small' ? 'img-small' : 'img-large'}`}>
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
          overflow: hidden;
        }
        .img-large {
          width: var(--img-large);
          height: var(--img-large);
        }
        .img-small {
          width: var(--img-small);
          height: var(--img-small);
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