'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFund } from '@/hooks/useFund';
import { useAuth } from '@/hooks/useAuth';
import { useCategory } from '@/hooks/useCategory';
import { useToast } from '@/context/ToastContext';
import PriceManagement from '@/components/funds/PriceManagement';
import BasicInformation from '@/components/funds/BasicInformation';
import FinancialInformation from '@/components/funds/FinancialInformation';
import FeesStructure from '@/components/funds/FeesStructure';
import Operations from '@/components/funds/Operations';
import FundImages from '@/components/funds/FundImages';
import FundEntities from '@/components/funds/FundEntities';
import FundManagers from '@/components/funds/FundManagers';
import FundDocuments from '@/components/funds/FundDocuments';

const EditFundPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { getFundById, updateFund, updateFundPrice, getFundPriceHistory, isLoading, error, successMessage, clearError, clearSuccessMessage } = useFund();
  const { getCategoriesWithTranslations, categories: categoriesList } = useCategory();
  const { showSuccess, showError } = useToast();
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Price form state
  const [priceData, setPriceData] = useState({
    currentprice: '',
    newprice: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Fund details form state
  const [fundData, setFundData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    fund_manager_name_ar: '',
    fund_manager_name_en: '',
    currency: 'EGP',
    currency_ar: 'جنيه مصرى',
    minimum_initial: '',
    minimum_initial_ar: '',
    Minimum_redemption_amount: '',
    Minimum_redemption_amount_ar: '',
    subscription_fee: '',
    subscription_fee_ar: '',
    redemption_fee: '',
    redemption_fee_ar: '',
    annualfee: '',
    annualfee_ar: '',
    subscription_frequency_ar: '',
    subscription_frequency_en: '',
    redemption_frequency_ar: '',
    redemption_frequency_en: '',
    type_ar: '',
    type_en: '',
    catid: '',
    fund_link: '',
    created_at: '',
    image: '',
    fund_manager_image: ''
  });
  
  // Image files state
  const [imageFiles, setImageFiles] = useState({
    image: null,
    fund_manager_image: null
  });
  
  // Price history state
  const [priceHistory, setPriceHistory] = useState({
    latest: null,
    previous: null
  });

  // Fetch categories
  const fetchCategories = async () => {
    if (token && !categoriesLoaded) {
      try {
        await getCategoriesWithTranslations(token);
        setCategoriesLoaded(true);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
  };

  // Fetch fund data and price history
  useEffect(() => {
    if (id && token) {
      fetchFundData();
      fetchPriceHistory();
      fetchCategories();
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
        currentprice: mergedFundData.currentprice || mergedFundData.latest_price || '',
        newprice: '', 
        date: new Date().toISOString().split('T')[0]
      });
      console.log('latest_price:', mergedFundData.latest_price );
      console.log('currentprice:', mergedFundData.currentprice );
      console.log('mergedFundData:', mergedFundData.status );
      
      // Set fund details form data with both languages
      setFundData({
        name_ar: actualAr.name || '',
        name_en: actualEn.name || '',
        description_ar: actualAr.description || '',
        description_en: actualEn.description || '',
        fund_manager_name_ar: actualAr.fund_manager_name || '',
        fund_manager_name_en: actualEn.fund_manager_name || '',
        currency: actualEn.currency || 'EGP',
        currency_ar: actualAr.currency || 'جنيه مصرى',
        minimum_initial: actualEn.minimum_initial || '',
        minimum_initial_ar: actualAr.minimum_initial || '',
        Minimum_redemption_amount: actualEn.Minimum_redemption_amount || '',
        Minimum_redemption_amount_ar: actualAr.Minimum_redemption_amount || '',
        subscription_fee: actualEn.subscription_fee || '',
        subscription_fee_ar: actualAr.subscription_fee || '',
        redemption_fee: actualEn.redemption_fee || '',
        redemption_fee_ar: actualAr.redemption_fee || '',
        annualfee: actualEn.annualfee || '',
        annualfee_ar: actualAr.annualfee || '',
        subscription_frequency_ar: actualAr.subscription_frequency || '',
        subscription_frequency_en: actualEn.subscription_frequency || '',
        redemption_frequency_ar: actualAr.redemption_frequency || '',
        redemption_frequency_en: actualEn.redemption_frequency || '',
        type_ar: actualAr.type || '',
        type_en: actualEn.type || '',
        catid: actualEn.catid || '',
        fund_link: actualEn.fund_link || '',
        created_at: actualEn.created_at?.split('T')[0] || '',
        image: actualEn.image || '',
        fund_manager_image: actualEn.fund_manager_image || ''
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
      
      // Show success toast
      showSuccess('Fund price updated successfully!');
      
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

  const handleFundSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Add all fund fields
      Object.keys(fundData).forEach(key => {
        formData.append(key, fundData[key]);
      });
      
      // Add image files if they exist
      if (imageFiles.image) {
        formData.append('image', imageFiles.image);
      }
      if (imageFiles.fund_manager_image) {
        formData.append('fund_manager_image', imageFiles.fund_manager_image);
      }
      
      await updateFund(id, formData);
      
      // Show success toast
      showSuccess('Fund details updated successfully!');
    } catch (err) {
      console.error('Error updating fund:', err);
      showError('Failed to update fund details. Please try again.');
    }
  };

  const handlePriceChange = (e) => {
    setPriceData({
      ...priceData,
      [e.target.name]: e.target.value
    });
  };

  const handleFundChange = (e) => {
    setFundData({
      ...fundData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (name, file) => {
    setImageFiles({
      ...imageFiles,
      [name]: file
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
              <h1 className="text-3xl font-bold text-white mb-2">Edit Fund</h1>
              <p className="text-blue-100">Update fund information and pricing</p>
            </div>
            <Link
              href="/dashboard/funds"
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

        {/* Fund Details Form */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold  mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-[#00437a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Fund Details
          </h2>
          
          <form onSubmit={handleFundSubmit} className="space-y-6">
            {/* Basic Information Component */}
            <BasicInformation
              fundData={fundData}
              handleFundChange={handleFundChange}
            />
            
            {/* Financial Information Component */}
            <FinancialInformation
              fundData={fundData}
              handleFundChange={handleFundChange}
            />
            
            {/* Fees Structure Component */}
            <FeesStructure
              fundData={fundData}
              handleFundChange={handleFundChange}
            />
            
            {/* Operations Component */}
            <Operations
              fundData={fundData}
              handleFundChange={handleFundChange}
              categories={categoriesList}
            />
            
            {/* Fund Images Component */}
            <FundImages
              fundData={fundData}
              handleImageChange={handleImageChange}
            />
            
            {/* Creation Date */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">Creation Date</label>
                  <input
                    type="date"
                    name="created_at"
                    value={fundData.created_at}
                    onChange={handleFundChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#00437a] text-white font-medium rounded-lg hover:bg-[#003560] transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Fund Details'}
              </button>
            </div>
          </form>
          

        </div>
          {/* Fund Documents Component - Outside the main form */}
          <div className="mt-12 bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
            <FundDocuments fundId={id} />
          </div>
          
          {/* Fund Entities Component - Outside the main form */}
          <div className="mt-12 bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
            <FundEntities fundId={id} />
          </div>
          
          {/* Fund Managers Component - Outside the main form */}
          <div className="mt-12 bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
            <FundManagers fundId={id} />
          </div>
      </div>
    </div>
  );
};

export default EditFundPage;
