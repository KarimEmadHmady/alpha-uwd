// Fund Manager Service - Handles all fund manager-related API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fundManagerService = {
  // Get all fund managers for a specific fund
  getFundManagersByFundId: async (fundId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fund-managers/fund/${fundId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      throw error;
    }
  },

  // Create a new fund manager
  createFundManager: async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fund-managers`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Service: Error creating fund manager:', error);
      throw error;
    }
  },

  // Update an existing fund manager
  updateFundManager: async (managerId, formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fund-managers/${managerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating fund manager:', error);
      throw error;
    }
  },

  // Delete a fund manager
  deleteFundManager: async (managerId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fund-managers/${managerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true; // Return true on successful deletion
    } catch (error) {
      console.error('Error deleting fund manager:', error);
      throw error;
    }
  }
};

export default fundManagerService;
