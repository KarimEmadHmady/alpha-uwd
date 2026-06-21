"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import FundSidebar from "./FundSidebar";
import FundDetails from "./FundDetails";
import Performance from "./Performance";
import FundManager from "./FundManager";
import FundFiles from "./FundFiles";
import { fundService } from "@/services/fundService";
import HeroSection from "./HeroSection";
import Image from 'next/image';

type Tab = "details" | "performance" | "manager" | "files";

function OtherFundCard({
  name,
  type,
  price,
  currency,
  lastUpdate,
  logo,
}: {
  name: string;
  type: string;
  price: number;
  currency: string;
  lastUpdate: string;
  logo: string;
}) {
 return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-sm dark:hover:shadow-black/30 transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 relative shrink-0">
          <Image
            src={logo}
            alt={`${name} logo`}
            fill
            className="object-contain"
            sizes="32px"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="text-gray-800 dark:text-gray-50 font-semibold text-sm">{name}</p>
            <span className="text-xs text-gray-400 dark:text-gray-500">{lastUpdate}</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{type}</p>
          <p className="text-orange-500 dark:text-orange-400 text-sm font-semibold mt-1">
            Price: {price ? price.toLocaleString("en-US", { minimumFractionDigits: 3 }) : '0.000'} {currency}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FundPage() {
  const params = useParams();
  const fundId = params?.id as string;
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [fundData, setFundData] = useState<any>(null);
  const [otherFunds, setOtherFunds] = useState<any[]>([]);
  const [priceHistories, setPriceHistories] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFundData = async () => {
      if (!fundId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch current fund data
        const fundResponse = await fundService.getFundByIdPublic(fundId, locale);
        const fundDataToSet = fundResponse?.data || fundResponse;
        console.log('API Response:', fundResponse);
        console.log('Fund Data to Set:', fundDataToSet);
        setFundData(fundDataToSet);
        
        // Fetch price history for the current fund
        try {
          const priceHistoryResponse = await fundService.getFundPriceHistory(fundId);
          setPriceHistories({ [parseInt(fundId)]: priceHistoryResponse?.dates || null });
        } catch {
          setPriceHistories({ [parseInt(fundId)]: null });
        }
        
        // Fetch other funds for the sidebar
        const allFundsResponse = await fundService.getAllFundsPublic(locale);
        const allFunds = allFundsResponse?.funds_all || allFundsResponse?.data || allFundsResponse || [];
        const other = Array.isArray(allFunds) 
          ? allFunds.filter((fund: any) => fund.id !== parseInt(fundId)).slice(0, 3)
          : [];
        setOtherFunds(other);
      } catch (err: any) {
        setError(err.message || 'Failed to load fund data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundData();
  }, [fundId, locale]);

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return <FundDetails fundData={fundData} />;
      case "performance":
        return <Performance fundData={fundData} />;
      case "manager":
        return <FundManager fundData={fundData} />;
      case "files":
        return <FundFiles fundData={fundData} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!fundData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Fund not found</p>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] px-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <HeroSection />
      <div className="max-w-6xl mx-auto flex gap-6 py-5">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Animated content swap */}
          <div key={activeTab} className="animate-fadeIn">
            {renderContent()}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 w-72 shrink-0 mb-5">
          {/* Sidebar / Navigation Card */}
          <FundSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            fundName={fundData.fundDetails?.name || fundData.fundDetails?.fund_name}
            fundType={fundData.fundDetails?.type || fundData.fundDetails?.categoryName}
            price={parseFloat(fundData.fundDetails?.status === 1 ? (fundData.fundDetails?.newprice || fundData.fundDetails?.currentprice || '0') : (fundData.fundDetails?.currentprice || fundData.fundDetails?.newprice || '0')) || 0}
            currency={fundData.fundDetails?.currency || 'EGP'}
            lastUpdate={fundData.fundDetails?.updated_at}
            logo={fundData.fundDetails?.image || fundData.fundDetails?.logo || '/funds/default.png'}
            fundData={fundData}
            priceHistory={priceHistories[parseInt(fundId)]}
          />

          {/* Other Funds */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-3">
              {locale === 'ar' ? 'صناديق أخرى' : 'Other Funds'}
            </h3>
            <div className="space-y-3">
              {otherFunds.map((f: any) => (
                <div 
                  key={f.id} 
                  onClick={() => router.push(`/services/fundsmanagement/${f.id}`)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors duration-200"
                >
                  <OtherFundCard 
                    name={f.name || f.fund_name}
                    type={f.type || f.category}
                    price={parseFloat(f.status === 1 ? (f.newprice || f.currentprice || '0') : (f.currentprice || f.newprice || '0')) || 0}
                    currency={f.currency || 'EGP'}
                    lastUpdate={f.updated_at}
                    logo={f.image || f.logo || '/funds/default.png'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}