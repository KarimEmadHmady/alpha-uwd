// components/HeroStats.tsx  ← Client Component للـ animations بس
'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Props {
  totalUsersLabel:       string;
  activeUsersLabel:      string;
  activeUsersSubLabel:   string;
  satisfiedClientsLabel: string;
  reviewsLabel:          string;
  backgroundImage?:       string;
}

export default function HeroStats({
  totalUsersLabel,
  activeUsersLabel,
  activeUsersSubLabel,
  satisfiedClientsLabel,
  reviewsLabel,
  backgroundImage,
}: Props) {
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');


  useEffect(() => {
    const counters = [
      { el: counterRefs.current[0], target: 200000, prefix: '+', suffix: '' },
      { el: counterRefs.current[1], target: 50,     prefix: '',  suffix: 'M' },
      { el: counterRefs.current[2], target: 200000, prefix: '+', suffix: '' },
      { el: counterRefs.current[3], target: 600,    prefix: '',  suffix: '+' },
    ];
    counters.forEach(({ el, target, prefix, suffix }) => {
      if (!el) return;
      let start = 0;
      const step = target / (1800 / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(timer); }
        el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
      }, 16);

    });
  }, []);

  return (
    <div className="relative h-[480px] lg:h-[520px]">

      {/* Total Users */}
      <div className="absolute top-4 left-0 z-10 bg-white dark:bg-[#2a2a2a] 
  border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg px-5 py-3 text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          <span ref={el => { counterRefs.current[0] = el; }}>0</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{totalUsersLabel}</p>
      </div>

      {/* Hero Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-md mx-auto">
          <Image src={`${BASE_URL}/${backgroundImage ? backgroundImage : (backgroundImage ? `/${backgroundImage}` : "/hero-person.png")}`} alt="Financial Advisor" fill
            className="object-contain object-center drop-shadow-xl" priority />
          <div className="absolute inset-[10%] rounded-full bg-[#e8f1f8] dark:bg-[#1e3a52] -z-10" />
        </div>
      </div>

      {/* Active Users */}
      <div className="absolute bottom-28 left-0 z-10 bg-[#00437A] text-white rounded-2xl shadow-xl px-5 py-3 min-w-[140px] opacity-80">
        <p className="text-xs text-blue-200 mb-0.5">{activeUsersLabel}</p>
        <p className="text-2xl font-bold">
          <span ref={el => { counterRefs.current[1] = el; }}>0</span>
        </p>
        <p className="text-xs text-blue-200">{activeUsersSubLabel}</p>
      </div>

      {/* Satisfied Clients */}
      <div className="absolute bottom-6 right-0 z-10 bg-white dark:bg-[#2a2a2a] 
  border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg px-5 py-3 text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          <span ref={el => { counterRefs.current[2] = el; }}>0</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{satisfiedClientsLabel}</p>
      </div>

      {/* Reviews */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
              <Image src={`/avatars/avatar-${i}.jpg`} alt="" width={36} height={36} className="object-cover" />
            </div>
          ))}
        </div>
        <div>
          <div className="flex text-amber-400 text-sm">★★★★★</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            From <span ref={el => { counterRefs.current[3] = el; }}>0+</span> {reviewsLabel}
          </p>
        </div>
      </div>
    </div>
  );
}










