'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';

const Operations = ({ fundData, handleFundChange, categories = [] }) => {
  const { showSuccess } = useToast();

  const handleOperationChange = (e) => {
    const { name, value } = e.target;
    handleFundChange(e);
    
    // Show toast for important operations
    if (name === 'subscription_frequency_en' || name === 'subscription_frequency_ar') {
      showSuccess(`Subscription frequency updated to ${value}`);
    }
    
    if (name === 'category_id') {
      const category = categories.find(cat => cat.id === parseInt(value));
      showSuccess(`Category updated to ${category?.name || 'Unknown'}`);
    }
  };
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Operations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Frequency */}
        <div>
          <label className="block text-sm font-medium  mb-2">Subscription Frequency (English)</label>
          <select
            name="subscription_frequency_en"
            value={fundData.subscription_frequency_en}
            onChange={handleOperationChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Subscription Frequency (Arabic)</label>
          <select
            name="subscription_frequency_ar"
            value={fundData.subscription_frequency_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
          >
            <option value="يومي">يومي</option>
            <option value="أسبوعي">أسبوعي</option>
            <option value="شهري">شهري</option>
            <option value="ربع سنوي">ربع سنوي</option>
          </select>
        </div>

        {/* Redemption Frequency */}
        <div>
          <label className="block text-sm font-medium  mb-2">Redemption Frequency (English)</label>
          <select
            name="redemption_frequency_en"
            value={fundData.redemption_frequency_en}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Redemption Frequency (Arabic)</label>
          <select
            name="redemption_frequency_ar"
            value={fundData.redemption_frequency_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
          >
            <option value="يومي">يومي</option>
            <option value="أسبوعي">أسبوعي</option>
            <option value="شهري">شهري</option>
            <option value="ربع سنوي">ربع سنوي</option>
          </select>
        </div>

        {/* Fund Type */}
        <div>
          <label className="block text-sm font-medium  mb-2">Fund Type (English)</label>
          <select
            name="type_en"
            value={fundData.type_en}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
          >
            <option value="Equity">Equity</option>
            <option value="Bond">Bond</option>
            <option value="Money Market">Money Market</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Fund Type (Arabic)</label>
          <select
            name="type_ar"
            value={fundData.type_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
          >
            <option value="أسهم">أسهم</option>
            <option value="سندات">سندات</option>
            <option value="سوق النقد">سوق النقد</option>
            <option value="مختلط">مختلط</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium  mb-2">Category</label>
          <select
            name="catid"
            value={fundData.catid}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none text-gray-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name || category.name_ar || `Category ${category.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Fund Link */}
        <div>
          <label className="block text-sm font-medium  mb-2">Fund Website Link</label>
          <input
            type="url"
            name="fund_link"
            value={fundData.fund_link}
            onChange={handleFundChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="https://example.com/fund"
          />
        </div>
      </div>
    </div>
  );
};

export default Operations;
