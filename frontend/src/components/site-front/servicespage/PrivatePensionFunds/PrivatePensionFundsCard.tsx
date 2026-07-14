'use client';

import Image from "next/image";

interface PrivatePensionFundsCardProps {
  data?: any;
  BASE_URL?: string;
  lang?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function PrivatePensionFundsCard({
  data,
  BASE_URL,
  lang,
  imageSrc,
  imageAlt,
}: PrivatePensionFundsCardProps) {
  // Ensure data exists with fallbacks
  const safeData = data || {};
  const safeLang = lang || 'en';

  // Use dynamic data if available, otherwise use props
  let finalImageSrc = safeData.serviceImage || imageSrc || "/services/private-pension-funds2.jpg";

  // Fix protocol-relative URLs
  if (finalImageSrc && finalImageSrc.startsWith('//')) {
    finalImageSrc = `https:${finalImageSrc}`;
  }

  const finalImageAlt = imageAlt || "Private Pension Funds";

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
            {safeData.title || 'Private Pension Funds'}
          </h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm lg:text-base">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {safeData.boldLeadIn || 'Alpha Financial Investments Management Company'}
            </span>{' '}
            {safeData.description ||
              'specializes in managing private pension funds by managing securities portfolios for those funds in light of the Unified Insurance Law No. 155 of 2024 and the Board of Directors of the Authority Resolution No. 269 of 2024. The company manages a diverse group of private pension funds with a total value exceeding 8 billion Egyptian pounds.'}
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