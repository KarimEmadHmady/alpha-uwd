"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

type Tab = "details" | "performance" | "manager" | "files";

interface FundSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  fundName: string;
  fundType: string;
  price: number;
  currency: string;
  lastUpdate: string;
  logo: string;
  fundData?: any;
  priceHistory?: any;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "details", label: "Fund Details" },
  { key: "performance", label: "Performance" },
  { key: "manager", label: "Fund Manager" },
  { key: "files", label: "Files" },
];

export default function FundSidebar({
  activeTab,
  onTabChange,
  fundName,
  fundType,
  price,
  currency,
  lastUpdate,
  logo,
  fundData,
  priceHistory,
}: FundSidebarProps) {
  const t = useTranslations();
  const locale = useLocale();

  // Get the correct date based on status
  const fundDetails = fundData?.fundDetails || fundData || {};
  const status = fundDetails?.status;
  const displayDate = status === 1
    ? priceHistory?.latest?.date
    : priceHistory?.previous?.date;

  const formattedDate = displayDate ? new Date(displayDate).toLocaleDateString(locale) : lastUpdate;

  // Debug: Log the data to see what we're getting
  console.log('FundSidebar data:', { fundData, fundDetails, price, logo, status, priceHistory });

  const tabs: { key: Tab; label: string }[] = [
    { key: "details", label: t("fundSidebar.details") },
    { key: "performance", label: t("fundSidebar.performance") },
    { key: "manager", label: t("fundSidebar.manager") },
    { key: "files", label: t("fundSidebar.files") },
  ];

return (
  <div className="w-72 shrink-0">
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          {/* Logo */}
          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-50 dark:bg-gray-800">
            <Image
              src={logo || '/funds/default.png'}
              alt={`${fundName} logo`}
              fill
              className="object-contain p-2"
              sizes="48px"
              onError={(e) => {
                e.currentTarget.src = '/funds/default.png';
              }}
            />
          </div>
          <span className="text-[10px] text-blue-500 dark:text-blue-400 font-medium">
            {t('fundSidebar.lastUpdate')}: {formattedDate}
          </span>
        </div>

        <p className={`text-gray-800 dark:text-gray-50 font-bold text-sm leading-tight ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
          {fundName}
        </p>
        <p className={`text-gray-500 dark:text-gray-400 text-xs mt-0.5 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
          {fundType}
        </p>

        {/* Description */}
        {fundDetails?.description && (
          <p className={`text-gray-500 dark:text-gray-400 text-xs mt-2 leading-relaxed line-clamp-2 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
            {fundDetails.description}
          </p>
        )}

        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-[#f97316] text-sm font-semibold">
            {t('fundSidebar.price')}: {price ? price.toLocaleString("en-US", { minimumFractionDigits: 3 }) : '0.000'}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {currency}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* Tabs */}
      <div className="p-3 flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[#00437A] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                activeTab === tab.key
                  ? "bg-white text-[#00437A]"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);
}