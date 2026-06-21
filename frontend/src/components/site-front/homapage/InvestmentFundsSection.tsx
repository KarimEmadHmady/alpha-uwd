'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { fundService } from '@/services/fundService';

export default function InvestmentFundsSection() {
  const [active, setActive] = useState(0);
  const [funds, setFunds] = useState<any[]>([]);
  const [priceHistories, setPriceHistories] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const locale = useLocale();
  const t = useTranslations('InvestmentFunds');

  /* ─────────────────────────────── data ─────────────────────────────── */
  const getAllFunds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fundService.getAllFundsPublic(locale);
      const fundsData = response?.funds_all || response?.data || response;
      const arr = Array.isArray(fundsData) ? fundsData : [];
      setFunds(arr);

      const histories: Record<number, any> = {};
      await Promise.allSettled(
        arr.map(async (fund: any) => {
          try {
            const res = await fundService.getFundPriceHistory(fund.id);
            histories[fund.id] = res?.dates || null;
          } catch {
            histories[fund.id] = null;
          }
        })
      );
      setPriceHistories(histories);
    } catch (err: any) {
      setError(err.message || 'Failed to load funds');
      setFunds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { getAllFunds(); }, [locale]);

  /* ── track visibleCount for dots (CSS handles layout, JS only counts) ── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ──────────────────────── scroll to card ──────────────────────────── */
  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement;
    if (!card) return;
    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setActive(index);
  };

  /* ──────────── sync active dot while user scrolls / swipes ─────────── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth ?? 0;
      if (cardWidth === 0) return;
      const idx = Math.round(container.scrollLeft / (cardWidth + 24)); // 24 = gap
      setActive(idx);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [funds]);

  /* ──────────────────────────── auto-play ────────────────────────────── */
  useEffect(() => {
    if (funds.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setActive((prev) => {
        const next = prev + 1 >= funds.length ? 0 : prev + 1;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [funds]);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  /* ──────────────────────────────── UI ──────────────────────────────── */
  return (
    <section className="py-20 bg-gray-100 dark:bg-[#222] " dir="ltr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-sm  mb-4 text-gray-800 dark:text-gray-50 ">
            {t('title')}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{t('errorLoadingFunds')}: {error}</p>
          </div>
        )}

        {/* ── Carousel ── */}
        {!isLoading && !error && funds.length > 0 && (
          <>
            {/*
              CSS does ALL the layout work:
              - grid-cols-1 / sm:grid-cols-2 / lg:grid-cols-3  → card widths via CSS
              - overflow-x-auto + scroll-snap                   → snapping without JS
              - no JS measurement needed at all
            */}
            <div
              ref={scrollRef}
              className="
                grid grid-flow-col auto-cols-[100%]
                sm:auto-cols-[calc(50%-12px)]
                lg:auto-cols-[calc(33.333%-16px)]
                gap-6
                overflow-x-auto
                scroll-smooth
                snap-x snap-mandatory
                scrollbar-hide
                pb-2
              "
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={stopAutoPlay}
              onTouchStart={stopAutoPlay}
            >
              {funds.map((fund, i) => {
                const history = priceHistories[fund.id];
                const date = fund.status
                  ? history?.latest?.date
                  : history?.previous?.date;

                return (
                  <div key={fund.id ?? i} className="snap-start">
                    <Link href={`/services/fundsmanagement/${fund.id}`} className="block h-full">
                      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-all duration-300 flex flex-col gap-4 h-full hover:bg-gray-50 dark:hover:bg-[#333] hover:-translate-y-0.5">

                        {/* Top row */}
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex-shrink-0">
                            <Image
                              src={
                                fund.image
                                  ? fund.image.startsWith('http')
                                    ? fund.image
                                    : `/${fund.image.replace(/^\/+/, '')}`
                                  : '/funds/default.png'
                              }
                              alt={fund.name || 'Fund'}
                              fill
                              className="object-contain p-1  "
                              onError={(e) => { e.currentTarget.src = '/funds/default.png'; }}
                            />
                          </div>
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ background: '#00437A18', color: '#00437A' }}
                          >
                            {fund.type || t('fund')}
                          </span>
                        </div>

                        {/* Last update */}
                        <p className="text-[11px] text-gray-400">
                          {t('lastUpdate')}:{' '}
                          {date ? new Date(date).toLocaleDateString() : t('recent')}
                        </p>

                        {/* Name & description */}
                        <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                          <h3 className="font-bold text-base leading-snug text-gray-800 dark:text-gray-200">
                            {fund.name || t('unnamedFund')}
                          </h3>
                          <p className="text-sm mt-1 line-clamp-2 text-gray-800 dark:text-gray-50">
                            {fund.description || t('investmentFund')}
                          </p>
                        </div>

                        {/* Price + link */}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                          <div>
                            <p className="text-[11px] text-gray-400">{t('price')}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-50">
                                {fund.status === 1 ? (fund.newprice || '0.00') : (fund.currentprice || '0.00')}
                              </span>
                              <span className="text-xs text-gray-400">
                                {fund.currency || 'EGP'}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-[#00437A] font-semibold flex items-center gap-1 hover:underline">
                            {t('seeMore')}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Dots — one per PAGE not per card */}
            {(() => {
              const totalPages = Math.ceil(funds.length / visibleCount);
              if (totalPages <= 1) return null;
              const activePage = Math.floor(active / visibleCount);
              return (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, pageIndex) => (
                    <button
                      key={pageIndex}
                      onClick={() => scrollToIndex(pageIndex * visibleCount)}
                      aria-label={`Go to page ${pageIndex + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        activePage === pageIndex
                          ? 'w-6 h-2.5 bg-[#00437A]'
                          : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </section>
  );
}