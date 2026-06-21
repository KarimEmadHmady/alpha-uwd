// app/dashboard/add-fund/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useFund } from '@/hooks/useFund';
import { useAuth } from '@/hooks/useAuth';
import { useCategory } from '@/hooks/useCategory';

const AddFundPage = () => {
  const [formData, setFormData] = useState({
    // Basic Info - Arabic and English side by side
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    fund_manager_name_ar: '',
    fund_manager_name_en: '',
    
    // Financial Info
    currentprice: '',
    currency: 'EGP',
    currency_ar: 'جنيه مصرى ',
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
    
    // Frequencies - Arabic and English side by side
    subscription_frequency_ar: '',
    subscription_frequency_en: '',
    redemption_frequency_ar: '',
    redemption_frequency_en: '',
    
    // Types - Arabic and English side by side
    type_ar: '',
    type_en: '',
    
    // Other
    catid: '',
    fund_link: '',
    created_at: new Date().toISOString().split('T')[0],
  });

  const [imageFile, setImageFile] = useState(null);
  const [fundManagerImageFile, setFundManagerImageFile] = useState(null);

  const { createFund, isLoading, error, successMessage, clearError, clearSuccessMessage } = useFund();
  const { token } = useAuth();
  const { getCategoriesWithTranslations, categories: categoriesList } = useCategory();
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        clearError();
      }, 5000);
    }
  }, [error]);

  // Fetch categories on component mount
  useEffect(() => {
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
    fetchCategories();
  }, [token, categoriesLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleFundManagerImageChange = (e) => {
    setFundManagerImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert('Please login to add a fund');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add image files if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (fundManagerImageFile) {
        formDataToSend.append('fund_manager_image', fundManagerImageFile);
      }

      await createFund(formDataToSend);
      
      // Reset form
      setFormData({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        fund_manager_name_ar: '',
        fund_manager_name_en: '',
        currentprice: '',
        currency: 'EGP',
        currency_ar: 'جنيه مصرى ',
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
        created_at: new Date().toISOString().split('T')[0],
      });
      setImageFile(null);
      setFundManagerImageFile(null);
      
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white dark:bg-white/10 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00437a] to-blue-700 p-6">
            <h1 className="text-2xl font-bold text-white">Add New Fund</h1>
            <p className="text-blue-100 mt-2">Create a new investment fund</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-green-700">{successMessage}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fund Names - Side by side */}
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Name (Arabic)</label>
                  <input
                    type="text"
                    name="name_ar"
                    value={formData.name_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="صندوق الأسهم السعودية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Name (English)</label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="Saudi Equity Fund"
                  />
                </div>

                {/* Descriptions - Side by side */}
                <div>
                  <label className="block text-sm font-medium  mb-2">Description (Arabic)</label>
                  <textarea
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="صندوق استثماري يركز على الأسهم السعودية المدرجة في السوق المالية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Description (English)</label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="Investment fund focusing on Saudi equities listed in the financial market"
                  />
                </div>

                {/* Fund Manager Names - Side by side */}
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Manager Name (Arabic)</label>
                  <input
                    type="text"
                    name="fund_manager_name_ar"
                    value={formData.fund_manager_name_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="شركة الفالح للاستثمار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Manager Name (English)</label>
                  <input
                    type="text"
                    name="fund_manager_name_en"
                    value={formData.fund_manager_name_en}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="Al Faleh Investment Company"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">Current Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="currentprice"
                    value={formData.currentprice}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="100.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Currency (English)</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black"
                  >
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Currency (Arabic)</label>
                  <select
                    name="currency_ar"
                    value={formData.currency_ar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black"
                  >
                    <option value="جنيه مصرى ">جنيه مصرى </option>
                    <option value="دولار">دولار</option>
                    <option value="يورو">يورو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Category</label>
                  <select
                    name="catid"
                    value={formData.catid}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black"
                  >
                    <option value="">Select a category</option>
                    {categoriesList.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name || category.name_ar || `Category ${category.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Minimum Initial Investment (English)</label>
                  <input
                    type="text"
                    name="minimum_initial"
                    value={formData.minimum_initial}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Minimum Initial Investment (Arabic)</label>
                  <input
                    type="text"
                    name="minimum_initial_ar"
                    value={formData.minimum_initial_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Minimum Redemption Amount (English)</label>
                  <input
                    type="text"
                    name="Minimum_redemption_amount"
                    value={formData.Minimum_redemption_amount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Minimum Redemption Amount (Arabic)</label>
                  <input
                    type="text"
                    name="Minimum_redemption_amount_ar"
                    value={formData.Minimum_redemption_amount_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Link</label>
                  <input
                    type="url"
                    name="fund_link"
                    value={formData.fund_link}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="https://example.com/fund-details"
                  />
                </div>
              </div>
            </div>

            {/* Fees */}
            <div>
              <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">Subscription Fee (English)</label>
                  <input
                    type="text"
                    step="0.01"
                    name="subscription_fee"
                    value={formData.subscription_fee}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Subscription Fee (Arabic) </label>
                  <input
                    type="text"
                    step="0.01"
                    name="subscription_fee_ar"
                    value={formData.subscription_fee_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Redemption Fee (English)</label>
                  <input
                    type="text"
                    step="0.01"
                    name="redemption_fee"
                    value={formData.redemption_fee}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Redemption Fee (Arabic)</label>
                  <input
                    type="text"
                    step="0.01"
                    name="redemption_fee_ar"
                    value={formData.redemption_fee_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Annual Fee (English)</label>
                  <input
                    type="text"
                    step="0.01"
                    name="annualfee"
                    value={formData.annualfee}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Annual Fee (Arabic)</label>
                  <input
                    type="text"
                    step="0.01"
                    name="annualfee_ar"
                    value={formData.annualfee_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* Frequencies - Side by side */}
            <div>
              <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Frequencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">Subscription Frequency (Arabic)</label>
                  <input
                    type="text"
                    name="subscription_frequency_ar"
                    value={formData.subscription_frequency_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="يومي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Subscription Frequency (English)</label>
                  <input
                    type="text"
                    name="subscription_frequency_en"
                    value={formData.subscription_frequency_en}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="Daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Redemption Frequency (Arabic)</label>
                  <input
                    type="text"
                    name="redemption_frequency_ar"
                    value={formData.redemption_frequency_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="يومي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Redemption Frequency (English)</label>
                  <input
                    type="text"
                    name="redemption_frequency_en"
                    value={formData.redemption_frequency_en}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="Daily"
                  />
                </div>
              </div>
            </div>

            {/* Types - Side by side */}
            <div>
              <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Fund Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Type (Arabic)</label>
                  <input
                    type="text"
                    name="type_ar"
                    value={formData.type_ar}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="أسهم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Type (English)</label>
                  <input
                    type="text"
                    name="type_en"
                    value={formData.type_en}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black"
                    placeholder="Equity"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black"
                  />
                  {imageFile && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {imageFile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">Fund Manager Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFundManagerImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black"
                  />
                  {fundManagerImageFile && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {fundManagerImageFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-[#00437a] to-blue-700 text-white font-medium rounded-lg hover:from-[#003560] hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Fund...' : 'Create Fund'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFundPage;
