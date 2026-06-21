"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { entityService } from "../../../../../services/entityService";
import { useAuth } from "../../../../../hooks/useAuth";

interface Entity {
  id: number;
  fund_id: number;
  entname: string;
  link: string;
  imageent: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface EntitiesResponse {
  success: number;
  data: Entity[];
  count: number;
}

interface EntitiesProps {
  fundId: number;
}

const Entities: React.FC<EntitiesProps> = ({ fundId }) => {
  const locale = useLocale();
  const { token } = useAuth();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Translations
  const isAr = locale === 'ar';
  const texts = {
    title: isAr ? 'الكيانات المرتبطة' : 'Related Entities',
    visitWebsite: isAr ? 'زيارة الموقع' : 'Visit Website',
    addedOn: isAr ? 'أضيف في' : 'Added on',
    noEntities: isAr ? 'لا توجد كيانات متاحة' : 'No entities available'
  };

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        const response: EntitiesResponse = await entityService.getEntitiesByFundId(fundId, token);
        if (response.success === 1) {
          setEntities(response.data);
        } else {
          setError('Failed to fetch entities');
        }
      } catch (err) {
        setError('Error loading entities');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (fundId) {
      fetchEntities();
    }
  }, [fundId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0d2d5a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-2">
        <p className="text-red-500 text-xs">{error}</p>
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-gray-500 text-xs">{texts.noEntities}</p>
      </div>
    );
  }

return (
  <div className="space-y-2">
    <h2 className={`text-lg font-bold text-gray-800 dark:text-gray-50 ${isAr ? 'text-right' : 'text-left'}`}>
      {texts.title}
    </h2>

    <div className={`flex flex-wrap gap-2 ${isAr ? 'rtl' : ''}`}>
      {entities.map((entity) => (
        <div
          key={entity.id}
          className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group flex-shrink-0"
          style={{ width: '200px' }}
        >
          {/* Entity Image */}
          <div className="relative h-16 overflow-hidden bg-gray-100 dark:bg-gray-800">
            {entity.imageent ? (
              <img
                src={entity.imageent}
                alt={entity.entname}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00437A] to-[#1e4a8f]">
                <div className="text-white text-sm font-bold">
                  {entity.entname.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Entity Content */}
          <div className="p-2">
            <h3 className={`text-xs font-semibold text-gray-800 dark:text-gray-50 mb-1 ${isAr ? 'text-right' : 'text-left'}`}>
              {entity.entname}
            </h3>

            {entity.link && (
              <a
                href={entity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00437A] dark:text-blue-400 hover:text-[#1e4a8f] dark:hover:text-blue-300 transition-colors duration-200 text-xs"
              >
                <span>{texts.visitWebsite}</span>
                <svg
                  className={`w-2 h-2 ml-1 ${isAr ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}

            <div className={`mt-1 pt-1 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 ${isAr ? 'text-right' : 'text-left'}`}>
              <p>{texts.addedOn} {new Date(entity.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Entities;
