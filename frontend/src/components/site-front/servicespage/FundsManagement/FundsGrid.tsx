"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { fundService } from "@/services/fundService";
import { useCategoryPublic } from "@/hooks/useCategoryPublic";

type FilterTab = "All" | string;

interface Category {
  id: number;
  name?: string;
  title?: string;
}

interface Fund {
  id: number;
  image: string;
  name: string;
  description: string;
  newprice?: string;
  currentprice?: string;
  currency?: string;
  updated_at?: string;
  category: FilterTab;
  href: string;
  status?: number;
}

function FundCard({ fund, priceHistory, lang }: { fund: Fund; priceHistory?: any; lang: string }) {
  const t = useTranslations('InvestmentFunds');

  const date = fund.status === 1 || fund.status === -1
    ? priceHistory?.latest?.date
    : priceHistory?.previous?.date;

  return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-black/30 p-4 flex flex-col gap-3 hover:shadow-md dark:hover:shadow-black/50 transition-shadow duration-200 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="w-14 h-10 relative">
          <Image
            src={fund.image ? (fund.image.startsWith('http') ? fund.image : `/${fund.image.replace(/^\/+/, '')}`) : '/funds/default.png'}
            alt={`${fund.name} logo`}
            fill
            className="object-contain"
            sizes="56px"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = '/funds/default.png';
            }}
          />
        </div>
        <span className="text-[11px] text-orange-500 dark:text-orange-400 font-medium">
          {t('lastUpdate')}: {date ? new Date(date).toLocaleDateString() : t('recent')}
        </span>
      </div>

      <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-50">{fund.name}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{fund.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('price')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {fund.status === 1 ? (fund.newprice || '0.00') : (fund.currentprice || '0.00')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {fund.currency || 'EGP'}
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-[#1a3c6e] dark:text-blue-400 hover:underline">
          {t('seeMore')}
        </span>
      </div>
    </div>
  );
}

// ✅ lang prop مطلوب دايماً — مش بيعتمد على useLocale()
export default function FundsGrid({ lang }: { lang: string }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [funds, setFunds] = useState<Fund[]>([]);
  const [priceHistories, setPriceHistories] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('InvestmentFunds');
  const { categories } = useCategoryPublic();

  useEffect(() => {
    const getFunds = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (activeTab === "All") {
          response = await fundService.getAllFundsPublic(lang);
        } else {
          const selectedCategory = (categories as Category[])?.find((cat: Category) =>
            (cat.name || cat.title) === activeTab
          );
          const categoryId = selectedCategory?.id;
          if (categoryId) {
            response = await fundService.getFundsByCategory(categoryId, lang);
          } else {
            response = await fundService.getAllFundsPublic(lang);
          }
        }

        const fundsData = response?.funds || response?.funds_all || response?.data || response;
        const rawFunds = Array.isArray(fundsData) ? fundsData : [];

        // جيب الـ history لكل fund
        const histories: Record<number, any> = {};
        await Promise.allSettled(
          rawFunds.map(async (fund: any) => {
            try {
              const res = await fundService.getFundPriceHistory(fund.id);
              histories[fund.id] = res?.dates || null;
            } catch {
              histories[fund.id] = null;
            }
          })
        );
        setPriceHistories(histories);

        setFunds(
          rawFunds.map((fund: any) => ({
            id: fund.id,
            image: fund.image || fund.logo || '/funds/default.png',
            name: fund.name || '',
            description: fund.description || '',
            newprice: fund.newprice || fund.currentprice || fund.price,
            currentprice: fund.currentprice || fund.newprice || fund.price,
            currency: fund.currency || 'EGP',
            updated_at: fund.updated_at || fund.lastUpdate,
            category: fund.category || 'All',
            status: fund.status,
            // ✅ الـ href فيه الـ locale صح
            href: `/${lang}/services/fundsmanagement/${fund.id}`,
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load funds');
        setFunds([]);
      } finally {
        setIsLoading(false);
      }
    };

    getFunds();
  }, [lang, activeTab]);

  return (
    <section className="w-full bg-[#f5f7fa] dark:bg-[#1a1a1a] px-6 py-10 md:px-12 lg:px-16" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            key="All"
            onClick={() => setActiveTab("All")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeTab === "All"
                ? "bg-[#1a3c6e] text-white shadow"
                : "bg-white dark:bg-transparent text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:border-[#1a3c6e] dark:hover:text-[#1a3c6e]"
            }`}
          >
            All
          </button>
          {categories.map((category: any) => (
            <button
              key={category.id || category.name}
              onClick={() => setActiveTab(category.name || category.title)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === (category.name || category.title)
                  ? "bg-[#1a3c6e] text-white shadow"
                  : "bg-white dark:bg-transparent text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:border-[#1a3c6e] dark:hover:text-[#1a3c6e]"
              }`}
            >
              {category.name || category.title}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3c6e]"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{t('errorLoadingFunds')}: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {funds.map((fund) => (
              // ✅ الـ href فيه الـ locale صح
              <Link key={fund.id} href={`/${lang}/services/fundsmanagement/${fund.id}`} className="block h-full">
                <FundCard
                  fund={fund}
                  priceHistory={priceHistories[fund.id]}
                  lang={lang}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}