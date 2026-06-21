'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFund } from '@/hooks/useFund';
import { useAuth } from '@/hooks/useAuth';
import { useCategory } from '@/hooks/useCategory';
import { useToast } from '@/context/ToastContext';
import PriceManagement from '@/components/funds/PriceManagement';


const EditFundPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { getFundById, updateFund, updateFundPrice, getFundPriceHistory, isLoading, error, successMessage, clearError, clearSuccessMessage } = useFund();
  const { showSuccess, showError } = useToast();
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Price form state
  const [priceData, setPriceData] = useState({
    currentprice: '',
    newprice: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Price history state
  const [priceHistory, setPriceHistory] = useState({
    latest: null,
    previous: null
  });


  // Fetch fund data and price history
  useEffect(() => {
    if (id && token) {
      fetchFundData();
      fetchPriceHistory();
    }
  }, [id, token]);

  // Handle success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const fetchFundData = async () => {
    try {
      setLoading(true);
      
      // Fetch both English and Arabic data
      const [fundDataEn, fundDataAr] = await Promise.all([
        getFundById(id, 'en'),
        getFundById(id, 'ar')
      ]);
      
      
      // Extract actual fund data from response (might be nested)
      const actualEn = fundDataEn?.fundDetails || fundDataEn?.fund || fundDataEn?.data || fundDataEn;
      const actualAr = fundDataAr?.fundDetails || fundDataAr?.fund || fundDataAr?.data || fundDataAr;
      
      // Merge both datasets
      const mergedFundData = { ...actualEn, ...actualAr };
      setFund(mergedFundData);
      
      // Set price form data - current price from fund, date from latest price update
      setPriceData({
        currentprice: mergedFundData.status === 1 
          ? (mergedFundData.newprice || mergedFundData.currentprice || '') 
          : (mergedFundData.currentprice || mergedFundData.latest_price || ''),
        newprice: '', // Always empty for new price input
        date: new Date().toISOString().split('T')[0]
      });
      

    } catch (err) {
      console.error('Error fetching fund data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const history = await getFundPriceHistory(id);
      console.log('Price History Data:', history);
      setPriceHistory(history);
    } catch (err) {
      console.error('Error fetching price history:', err);
    }
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFundPrice(id, {
        newprice: priceData.newprice,
        date: priceData.date
      });
      
      // Show success modal instead of toast
      setShowSuccessModal(true);
      
      // Refresh data to show updated current price and latest date
      await Promise.all([
        fetchPriceHistory(), // Refresh price history
        fetchFundData() // Refresh fund data to get updated current price
      ]);
    } catch (err) {
      console.error('Error updating price:', err);
      showError('Failed to update fund price. Please try again.');
    }
  };



    const handlePriceChange = (e) => {
    setPriceData({
      ...priceData,
      [e.target.name]: e.target.value
    });
  };


  if (loading) {
    return (
      <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00437a] to-blue-700 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Edit Fund Price</h1>
              <p className="text-blue-100">Update fund pricing and Date</p>
            </div>
            <Link
              href="/dashboard/funds-manager"
              className="px-6 py-3 bg-white text-[#00437a] font-medium rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              Back to Funds
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Price Management Component */}
        <PriceManagement
          priceData={priceData}
          priceHistory={priceHistory}
          fund={fund}
          handlePriceSubmit={handlePriceSubmit}
          handlePriceChange={handlePriceChange}
          isLoading={isLoading}
        />

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Update Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  Your price update request has been sent for review. The admin team will review and respond with approval or rejection. Please check your email for the response.
                </p>
              </div>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default EditFundPage;
