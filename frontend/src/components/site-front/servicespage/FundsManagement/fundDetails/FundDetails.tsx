"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Entities from "./Entities";

interface FundDetailsProps {
  fundData: any;
}

const FundDetails: React.FC<FundDetailsProps> = ({ fundData }) => {
  const t = useTranslations();
  const locale = useLocale();
  const fundDetails = fundData?.fundDetails || fundData || {};
  const overview = fundDetails?.description || '';

  const rows = [
    { label: t('fundDetails.type'), value: fundDetails?.type || 'N/A', highlight: true },
    { label: t('fundDetails.category'), value: fundDetails?.categoryName || 'N/A', highlight: true },
    { label: t('fundDetails.nav'), value: fundDetails?.status === 1 ? (fundDetails?.newprice || fundDetails?.currentprice) : (fundDetails?.currentprice || fundDetails?.newprice) || '0.00', highlight: false },
    { label: t('fundDetails.initialRelease'), value: fundDetails?.created_at ? new Date(fundDetails.created_at).toLocaleDateString() : 'N/A', highlight: true },
    { label: t('fundDetails.currency'), value: fundDetails?.currency || 'EGP', highlight: false },
    { label: t('fundDetails.redemptionFrequency'), value: fundDetails?.redemption_frequency || 'N/A', highlight: true },
    { label: t('fundDetails.subscriptionFrequency'), value: fundDetails?.subscription_frequency || 'N/A', highlight: true },
    { label: t('fundDetails.minInitial'), value: fundDetails?.minimum_initial || 'N/A', highlight: false },
    { label: t('fundDetails.minRedemption'), value: fundDetails?.Minimum_redemption_amount || 'N/A', highlight: false },
    { label: t('fundDetails.subscriptionFee'), value: fundDetails?.subscription_fee || 'N/A', highlight: true },
    { label: t('fundDetails.redemptionFee'), value: fundDetails?.redemption_fee || 'N/A', highlight: true },
    { label: t('fundDetails.annualFee'), value: fundDetails?.annualfee || 'N/A', highlight: true },
    { label: t('fundDetails.fundManager'), value: fundDetails?.fund_manager_name || 'N/A', highlight: true },
    { label: t('fundDetails.latestPrice'), value: fundDetails?.latest_price || 'N/A', highlight: false },
    { label: t('fundDetails.latestPriceDate'), value: (fundDetails?.latest_price_date && fundDetails?.status === 1 || fundDetails?.status === -1)  ? new Date(fundDetails.latest_price_date).toLocaleDateString() : 'N/A', highlight: false },
  ];
return (
  <div className="space-y-8">
    {/* Overview Section */}
    <div>
      <h1 className={`text-3xl font-bold text-gray-800 dark:text-gray-50 mb-4 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
        {t('fundDetails.overview')}
      </h1>
      <p className={`text-gray-500 dark:text-gray-400 text-sm leading-relaxed ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
        {overview}
      </p>
    </div>

    {/* Details Table */}
    <div>
      <h2 className={`text-2xl font-bold text-gray-800 dark:text-gray-50 mb-4 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
        {t('fundDetails.details')}
      </h2>
      <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden ${locale === 'ar' ? 'rtl' : ''}`}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={[
              'flex',
              'items-center',
              'justify-between',
              'px-6',
              'py-4',
              i !== rows.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : '',
              locale === 'ar' ? 'flex-row-reverse' : ''
            ].join(' ')}
          >
            <span className="text-gray-500 dark:text-gray-400 text-sm">{row.label}</span>
            <span
              className={[
                'text-sm',
                'font-medium',
                'text-right',
                'max-w-[55%]',
                row.highlight ? 'text-[#00437A] dark:text-blue-400' : 'text-gray-800 dark:text-gray-50'
              ].join(' ')}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Entities Section */}
    <Entities fundId={fundDetails?.id} />
  </div>
);
};

export default FundDetails;