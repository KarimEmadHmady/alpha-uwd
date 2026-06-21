'use client';

import Image from "next/image";
import Link from "next/link";

interface OdinInvestmentsCardProps {
  data?: any;
  BASE_URL?: string;
  lang?: string;
  imageSrc?: string;
  imageAlt?: string;
  websiteUrl?: string;
}

export default function OdinInvestmentsCardNew({
  data,
  BASE_URL,
  lang,
  imageSrc,
  imageAlt,
  websiteUrl,
}: OdinInvestmentsCardProps) {
  // Ensure data exists with fallbacks
  const safeData = data || {};
  const safeLang = lang || 'en';
  
  // Use dynamic data if available, otherwise use props
  let finalImageSrc = safeData.companyImage || imageSrc || "/odin-building.jpg";
  
  // Fix protocol-relative URLs
  if (finalImageSrc && finalImageSrc.startsWith('//')) {
    finalImageSrc = `https:${finalImageSrc}`;
  }
  
  const finalImageAlt = imageAlt || "Odin Investments HQ";
  const finalWebsiteUrl = safeData.websiteUrl || websiteUrl || "https://www.odininvestments.com";
return (
    <>
      <div className="w-full flex justify-center px-4 py-8" dir={safeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-[#1a1a1a] overflow-hidden max-w-7xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeUp">
        {/* Image Side - 2 columns */}
        <div className="lg:col-span-2 relative h-64 lg:h-auto min-h-96 overflow-hidden group p-5 rounded-2xl">
          <Image
            src={finalImageSrc || "/odin-building.jpg"}
            alt={finalImageAlt || "Odin Investments HQ"}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
        </div>

        {/* Content Side - 3 columns */}
        <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col gap-4">
          {/* Badge */}
          <div className="inline-flex items-center border-2 border-blue-900 dark:border-blue-400 rounded-full px-5 py-2 text-sm font-semibold text-blue-900 dark:text-blue-400 w-fit">
            {safeData.badgeText || 'Holding Company'}
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-blue-950 dark:text-gray-50 leading-tight">
            {safeData.title || 'Odin Investments'}
          </h2>

          {/* Text Content */}
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-sm lg:text-base">
            <p>
              {safeData.description1 || 'ODIN Investments is a leading EGX-listed financial services provider with a distinguished track record in capital markets accumulated over the last 40 years. The company is an extension to "Egyptians Abroad for Investment and Development", a company that has contributed throughout its history to the sustainable development in Egypt, as it contributed to the establishment of several companies in different sectors.'}
            </p>

            <p>
              {safeData.description2 || 'ODIN currently operates as a fully-fledged investment bank after undergoing a major restructuring in 2020. The company offers investment banking, asset management, and private equity services with dedicated teams of the highest caliber. Since rebranding into ODIN Investments, the company has executed a number of transactions in the Egyptian market from IPOs to M&As to restructuring of distressed companies, which has placed it among the top performing financial services providers over the last few years.'}
            </p>

            <p>
              {safeData.description3 || 'ODIN has been a pioneer in the financial industry and has introduced innovative investment vehicles to the market as it established the first real estate investment fund in Egypt back in 2018. The company looks to build on the amazing success achieved over the last few years and to continue enhancing the quality and variety of services on offer with a huge focus on innovation and building a sustainable business environment.'}
            </p>
          </div>

          {/* Button */}
          <div className="pt-2">
            <Link 
              href={finalWebsiteUrl || "https://www.odininvestments.com"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white rounded-full px-8 py-4 font-semibold text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
            >
              {safeData.buttonText || 'View Website'}
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
                  <path
                    d="M2 10L10 2M10 2H4M10 2V8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    
    <style jsx>{`
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(24px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeUp {
        animation: fadeUp 0.7s ease both;
      }
    `}</style>
    </>
  );
}
