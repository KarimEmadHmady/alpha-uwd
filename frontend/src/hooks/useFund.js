// hooks/useFund.js
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fundService } from '@/services/fundService';

// Helper: always get the freshest token available
const getToken = (reduxToken) => {
  // Try Redux token first
  if (reduxToken && reduxToken.trim()) return reduxToken;
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('auth_token');
    if (localToken && localToken.trim()) return localToken;
  }
  
  // Fallback to cookies if available
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      if (cookie.startsWith('auth_token=')) {
        return cookie.substring('auth_token='.length);
      }
    }
  }
  
  return null;
};

export const useFund = () => {
  const [funds, setFunds] = useState([]);
  const [currentFund, setCurrentFund] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { token: reduxToken } = useAuth();

  // Clear messages
  const clearError = () => setError(null);
  const clearSuccessMessage = () => setSuccessMessage(null);

  const setSuccessMessageWithTimeout = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const setErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Get all funds
  const getAllFunds = async () => {
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fundService.getAllFunds(t);
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
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      setError(null);
      const fundData = await fundService.getFundById(id, t, lang);
      setCurrentFund(fundData);
      return fundData;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Create fund
  const createFund = async (formData) => {
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fundService.createFund(formData, t);
      setSuccessMessageWithTimeout('Fund created successfully!');
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
    const t = getToken(reduxToken);
    if (!t) { 
      const errorMsg = 'No authentication token found. Please log in again.';
      setErrorWithTimeout(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fundService.updateFund(id, formData, t);
      setSuccessMessageWithTimeout('Fund updated successfully!');
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
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      setIsLoading(true);
      setError(null);
      await fundService.deleteFund(id, t);
      setSuccessMessageWithTimeout('Fund deleted successfully!');
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
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      setError(null);
      await fundService.reorderFunds(orderedIds, t);
      setSuccessMessageWithTimeout('Funds reordered successfully!');
      await getAllFunds();
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Update fund price
  const updateFundPrice = async (id, priceData) => {
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      setError(null);
      await fundService.updateFundPrice(id, priceData, t);
      setSuccessMessageWithTimeout('Fund price updated successfully!');
      return true;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Get fund price history
  const getFundPriceHistory = async (id) => {
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }
    
    try {
      const response = await fundService.getFundPriceHistory(id, t);
      return response?.dates || { latest: null, previous: null };
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Get waiting funds
  const getWaitingFunds = async (lang = 'en') => {
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      const response = await fundService.getWaitingFunds(t, lang);
      return response?.funds_all || [];
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Update fund status
  const updateFundStatus = async (id, status) => {
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      const response = await fundService.updateFundStatus(id, status, t);
      setSuccessMessageWithTimeout(`Fund ${status === 1 ? 'approved' : 'rejected'} successfully`);
      return response;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  // Decline fund with message
  const declineFund = async (id, message) => {
    const t = getToken(reduxToken);
    if (!t) { setErrorWithTimeout('Not authenticated. Please log in again.'); return; }

    try {
      const response = await fundService.declineFund(id, message, t);
      setSuccessMessageWithTimeout('Fund declined successfully');
      return response;
    } catch (err) {
      setErrorWithTimeout(err.message);
      throw err;
    }
  };

  return {
    funds,
    currentFund,
    isLoading,
    error,
    successMessage,
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