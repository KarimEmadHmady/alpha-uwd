import { useState, useRef } from 'react';
import { historyService } from '@/services/historyService';

export const useHistory = (token, filters = {}) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Fetch history data
  const fetchHistory = async (customFilters = {}) => {
    if (!token || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await historyService.getHistory({ ...filters, ...customFilters }, token);
      console.log('Hook: History response:', response);
      
      // Extract the history array from response
      const historyArray = response?.data || response?.history || response || [];
      console.log('Hook: History array:', historyArray);
      
      // Ensure data is always an array
      setHistory(Array.isArray(historyArray) ? historyArray : []);
    } catch (error) {
      setError('Failed to fetch history');
      console.error('Hook: Error fetching history:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recent activity (last 10 items) - only once
  const fetchRecentActivity = async () => {
    if (!token || isLoading || hasFetched.current) return;
    
    setIsLoading(true);
    setError(null);
    hasFetched.current = true;
    
    try {
      const recentActivity = await historyService.getRecentActivity(token);
      console.log('Hook: Recent activity:', recentActivity);
      setHistory(recentActivity);
    } catch (error) {
      setError('Failed to fetch recent activity');
      console.error('Hook: Error fetching recent activity:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch recent activity only once when token is available
  if (token && !hasFetched.current && !isLoading) {
    fetchRecentActivity();
  }

  // Get activity type based on data
  const getActivityType = (item) => {
    if (item.price && item.fund_name) {
      return {
        type: 'fund_update',
        title: 'Fund price updated',
        description: `${item.fund_name} - ${item.price}`,
        icon: 'currency',
        color: 'blue'
      };
    }
    
    return {
      type: 'general',
      title: 'Activity recorded',
      description: item.fund_name || 'System activity',
      icon: 'activity',
      color: 'gray'
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return {
    // State
    history,
    isLoading,
    error,
    
    // Actions
    fetchHistory,
    fetchRecentActivity,
    getActivityType,
    formatDate,
  };
};

export default useHistory;
