'use client';

import React from 'react';
import { useHistory } from '@/hooks/useHistory';
import { useAuth } from '@/hooks/useAuth';

const RecentActivity = () => {
  const { token } = useAuth();
  const { history, isLoading, error, getActivityType, formatDate } = useHistory(token);

  const getActivityIcon = (icon, color) => {
    const iconClasses = {
      currency: 'text-blue-600 bg-blue-100',
      activity: 'text-gray-600 bg-gray-100',
      user: 'text-green-600 bg-green-100',
      fund: 'text-purple-600 bg-purple-100',
    };

    const icons = {
      currency: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      activity: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      user: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ),
      fund: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      ),
    };

    return (
      <div className={`rounded-full p-2 mr-3 ${iconClasses[color] || iconClasses.activity}`}>
        {icons[icon] || icons.activity}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/10 rounded-lg">
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-full p-2 mr-3 animate-pulse">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Failed to load recent activity</div>
        <button className="text-sm text-blue-600 hover:text-blue-800">Retry</button>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p>No recent activity found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {history.slice(0, 10).map((item, index) => {
        const activity = getActivityType(item);
        
        return (
          <div key={item.id || index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/20 transition-colors">
            <div className="flex items-center flex-1 min-w-0">
              {getActivityIcon(activity.icon, activity.color)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {activity.description}
                </p>
                {item.username && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    by {item.username}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {formatDate(item.date || item.created_at)}
              </p>
              {item.price && (
                <p className="text-xs font-medium text-green-600 whitespace-nowrap">
                  ${item.price}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivity;
