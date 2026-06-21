// History Service - Handles all history-related API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const historyService = {
  // Get all history with pagination and filters
  getHistory: async (filters = {}, token) => {
    try {
      const { page = 1, fundid, userid, date, startDate, endDate } = filters;
      
      // Build query string
      const queryParams = new URLSearchParams({ page: page.toString() });
      
      if (fundid) queryParams.append('fundid', fundid.toString());
      if (userid) queryParams.append('userid', userid.toString());
      if (date) queryParams.append('date', date);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/api/funds/history?${queryParams}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('History service - Raw response:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },

  // Get history for specific fund
  getFundHistory: async (fundId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/funds/history?fundid=${fundId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('History service - Fund history:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching fund history:', error);
      throw error;
    }
  },

  // Get recent activity (last 10 activities)
  getRecentActivity: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/funds/history?page=1&limit=10`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('History service - Recent activity:', data);
      
      // Extract the history array from response
      const historyArray = data?.data || data?.history || data || [];
      return Array.isArray(historyArray) ? historyArray : [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },

  // Get activity by date range
  getActivityByDateRange: async (startDate, endDate, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/funds/history?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching activity by date range:', error);
      throw error;
    }
  }
};

export default historyService;
