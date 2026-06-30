'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Props {
  trustLabel?: string;
}

export default function HeroTrustBadge({ trustLabel = 'From' }: Props) {
  const counterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    const target = 600;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start).toLocaleString() + '+';
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex -space-x-2">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 bg-gray-200 dark:bg-gray-700 overflow-hidden"
          >
            <Image src={`/avatars/avatar-${i}.jpg`} alt="" width={36} height={36} className="object-cover" />
          </div>
        ))}
      </div>
      <div>
        <div className="flex text-amber-400 text-sm">★★★★★</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {trustLabel} <span ref={counterRef}>0+</span>
        </p>
      </div>
    </div>
  );
}
