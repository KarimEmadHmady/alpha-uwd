"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { fundManagerService } from "@/services/fundManagerService";

interface FundManagerProps {
  fundData: any;
}

const FundManager: React.FC<FundManagerProps> = ({ fundData }) => {
  const params = useParams();
  const fundId = params?.id as string;
  const t = useTranslations();

  const [managers, setManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fund managers data
  useEffect(() => {
    const fetchManagers = async () => {
      if (!fundId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fundManagerService.getFundManagersByFundId(fundId);
        const managersData = response?.data || [];
        setManagers(managersData);
      } catch (err: any) {
        setError(err.message || 'Failed to load fund managers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagers();
  }, [fundId]);

  // Simple SVG icons
  const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );

  const TwitterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );

  const LinkedinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );

return (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-6">
      {t('fundDetails.fundManager')}
    </h1>

    {/* Loading State */}
    {isLoading && (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
        </div>
      </div>
    )}

    {/* Error State */}
    {error && (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="text-center text-red-500 dark:text-red-400">
          <p>Error: {error}</p>
        </div>
      </div>
    )}

    {/* Managers List */}
    {!isLoading && !error && (
      <div className="space-y-4">
        {managers.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No fund managers available</p>
            </div>
          </div>
        ) : (
          managers.map((manager) => (
            <div key={manager.id} className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {manager.image ? (
                    <img src={manager.image} alt={manager.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-50">{manager.name}</h2>
                  {manager.name_arabic && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{manager.name_arabic}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    )}
  </div>
);
};

export default FundManager;