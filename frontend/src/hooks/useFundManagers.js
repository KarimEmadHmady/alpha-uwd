import { useState, useEffect } from 'react';
import { fundManagerService } from '@/services/fundManagerService';

export const useFundManagers = (fundId, token) => {
  const [fundManagers, setFundManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch fund managers for the fund
  const fetchFundManagers = async () => {
    if (!fundId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fundManagerService.getFundManagersByFundId(fundId, token);
      console.log('Hook: Raw response from API:', response);
      
      // Backend returns {data: [...]} so we need to extract the data array
      const managersArray = response?.data || response;
      console.log('Hook: Fund managers array:', managersArray);
      
      // Ensure data is always an array
      setFundManagers(Array.isArray(managersArray) ? managersArray : []);
    } catch (error) {
      setError('Failed to fetch fund managers');
      console.error('Error fetching fund managers:', error);
      setFundManagers([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch fund managers when fundId changes
  useEffect(() => {
    fetchFundManagers();
  }, [fundId, token]);

  // Add new fund manager
  const addFundManager = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      console.log('Hook: Adding fund manager with formData:', formData);
      await fundManagerService.createFundManager(formData, token);
      await fetchFundManagers(); // Refresh the list
      setSuccessMessage('Fund manager added successfully');
      return true;
    } catch (error) {
      console.error('Hook: Error adding fund manager:', error);
      setError('Failed to add fund manager');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update fund manager
  const updateFundManager = async (managerId, formData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await fundManagerService.updateFundManager(managerId, formData, token);
      await fetchFundManagers(); // Refresh the list
      setSuccessMessage('Fund manager updated successfully');
      return true;
    } catch (error) {
      setError('Failed to update fund manager');
      console.error('Hook: Error updating fund manager:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete fund manager
  const deleteFundManager = async (managerId) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await fundManagerService.deleteFundManager(managerId, token);
      await fetchFundManagers(); // Refresh the list
      setSuccessMessage('Fund manager deleted successfully');
      return true;
    } catch (error) {
      setError('Failed to delete fund manager');
      console.error('Hook: Error deleting fund manager:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccessMessage('');
  };

  // Get fund manager by ID
  const getFundManagerById = (managerId) => {
    return fundManagers.find(manager => manager.id === managerId);
  };

  return {
    // State
    fundManagers,
    isLoading,
    error,
    successMessage,
    
    // Actions
    fetchFundManagers,
    addFundManager,
    updateFundManager,
    deleteFundManager,
    clearMessages,
    getFundManagerById,
  };
};

export default useFundManagers;
