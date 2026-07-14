'use client';

import Image from "next/image";

interface PortfolioManagementCardProps {
  data?: any;
  BASE_URL?: string;
  lang?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function PortfolioManagementCard({
  data,
  BASE_URL,
  lang,
  imageSrc,
  imageAlt,
}: PortfolioManagementCardProps) {
  // Ensure data exists with fallbacks
  const safeData = data || {};
  const safeLang = lang || 'en';

  // Use dynamic data if available, otherwise use props
  let finalImageSrc = safeData.serviceImage || imageSrc || "/services/portfolio-management2.jpg";

  // Fix protocol-relative URLs
  if (finalImageSrc && finalImageSrc.startsWith('//')) {
    finalImageSrc = `https:${finalImageSrc}`;
  }

  const finalImageAlt = imageAlt || "Portfolio Management";

  return (
    <div className="w-full flex justify-center px-4 py-12" dir={safeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text Side */}
        <div className="flex flex-col gap-4">
          {/* Eyebrow */}
          <span className="inline-flex items-center border-2 border-blue-900 dark:border-blue-400 rounded-full px-5 py-2 text-sm font-semibold text-blue-900 dark:text-blue-400 w-fit">
            {safeData.eyebrowText || 'Our Services'}
          </span>


          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#00437A] dark:text-[#00437A] uppercase tracking-wide">
            {safeData.title || 'Portfolio Management'}
          </h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm lg:text-base">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {safeData.boldLeadIn || 'Alpha Financial Investments'}
            </span>{' '}
            {safeData.description ||
              'is one of the leading companies in the field of portfolio formation and investment management. The company obtained its license from the Financial Regulatory Authority in 2009, and since then it has been providing its services to a diverse client base that includes individuals and institutional entities in both the public and private sectors. The company is committed to designing precise investment strategies that align with each client\u2019s objectives and risk profile. Alpha manages a wide range of investment portfolios, including private pension fund portfolios, equity portfolios for banks and public institutions, balanced portfolios for institutional clients, insurance company portfolios, and Islamic portfolios that comply with Sharia principles. The company continuously monitors financial markets and analyzes market trends, allowing it to adjust and develop investment strategies in response to economic and financial changes, with the aim of maximizing returns, minimizing risks, strengthening client confidence, and achieving sustainable growth for their investments.'}
          </p>
        </div>

        {/* Image Side */}
        <div className="relative w-full h-72 lg:h-96 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={finalImageSrc}
            alt={finalImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}