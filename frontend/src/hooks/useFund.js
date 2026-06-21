// hooks/useFund.js
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fundService } from '@/services/fundService';

export const useFund = () => {
  const [funds, setFunds] = useState([]);
  const [currentFund, setCurrentFund] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { token } = useAuth();

  // Clear messages
  const clearError = () => setError(null);
  const clearSuccessMessage = () => setSuccessMessage(null);

  // Auto-clear success message
  const setSuccessMessageWithTimeout = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Auto-clear error message
  const setErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  // Get all funds
  const getAllFunds = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fundService.getAllFunds(token);
      const fundsData = response?.funds_all || response?.data || response;
      setFunds(Array.isArray(fundsData) ? fundsData : []);
    } catch (err) {
      setErrorWithTimeout(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get single fund
  const getFundById = async (id, lang = 'en') => {
    if (!token) return;
    
    try {
      setError(null);
      const fundData = await fundService.getFundById(id, token, lang);
      setCurrentFund(fundData);
      return fundData;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Create fund
  const createFund = async (formData) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fundService.createFund(formData, token);
      setSuccessMessageWithTimeout('Fund created successfully!');
      // Refresh funds list
      await getAllFunds();
      return response;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update fund
  const updateFund = async (id, formData) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fundService.updateFund(id, formData, token);
      setSuccessMessageWithTimeout('Fund updated successfully!');
      // Refresh funds list
      await getAllFunds();
      return response;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete fund
  const deleteFund = async (id) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await fundService.deleteFund(id, token);
      setSuccessMessageWithTimeout('Fund deleted successfully!');
      // Refresh funds list
      await getAllFunds();
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reorder funds
  const reorderFunds = async (orderedIds) => {
    if (!token) return;
    
    try {
      setError(null);
      await fundService.reorderFunds(orderedIds, token);
      setSuccessMessageWithTimeout('Funds reordered successfully!');
      // Refresh funds list
      await getAllFunds();
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Update fund price
  const updateFundPrice = async (id, priceData) => {
    if (!token) return;
    
    try {
      setError(null);
      await fundService.updateFundPrice(id, priceData, token);
      setSuccessMessageWithTimeout('Fund price updated successfully!');
      return true;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Get fund price history
  const getFundPriceHistory = async (id) => {
    
    try {
      const response = await fundService.getFundPriceHistory(id);
      return response?.dates || { latest: null, previous: null };
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Get waiting funds
  const getWaitingFunds = async (lang = 'en') => {
    if (!token) return;
    
    try {
      const response = await fundService.getWaitingFunds(token, lang);
      return response?.funds_all || [];
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Update fund status
  const updateFundStatus = async (id, status) => {
    if (!token) return;
    
    try {
      const response = await fundService.updateFundStatus(id, status, token);
      setSuccessMessageWithTimeout(`Fund ${status === 1 ? 'approved' : 'rejected'} successfully`);
      return response;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Decline fund with message
  const declineFund = async (id, message) => {
    if (!token) return;
    
    try {
      const response = await fundService.declineFund(id, message, token);
      setSuccessMessageWithTimeout('Fund declined successfully');
      return response;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  return {
    // State
    funds,
    currentFund,
    isLoading,
    error,
    successMessage,

    // Actions
    getAllFunds,
    getFundById,
    createFund,
    updateFund,
    deleteFund,
    reorderFunds,
    updateFundPrice,
    getFundPriceHistory,
    getWaitingFunds,
    updateFundStatus,
    declineFund,
    clearError,
    clearSuccessMessage,
  };
};
