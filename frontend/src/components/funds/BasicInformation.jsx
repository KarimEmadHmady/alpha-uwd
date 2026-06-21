'use client';

import React from 'react';

const BasicInformation = ({ fundData, handleFundChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Basic Information</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fund Names - Side by side */}
          <div>
            <label className="block text-sm font-medium  mb-2">Fund Name (Arabic)</label>
            <input
              type="text"
              name="name_ar"
              value={fundData.name_ar}
              onChange={handleFundChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 "
              placeholder="صندوق الأسهم السعودية"
            />
          </div>
          <div>
            <label className="block text-sm font-medium  mb-2">Fund Name (English)</label>
            <input
              type="text"
              name="name_en"
              value={fundData.name_en}
              onChange={handleFundChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 "
              placeholder="Saudi Equity Fund"
            />
          </div>

          {/* Descriptions - Side by side */}
          <div>
            <label className="block text-sm font-medium  mb-2">Description (Arabic)</label>
            <textarea
              name="description_ar"
              value={fundData.description_ar}
              onChange={handleFundChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 "
              placeholder="صندوق استثماري يركز على الأسهم السعودية المدرجة في السوق المالية"
            />
          </div>
          <div>
            <label className="block text-sm font-medium  mb-2">Description (English)</label>
            <textarea
              name="description_en"
              value={fundData.description_en}
              onChange={handleFundChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 "
              placeholder="Investment fund focusing on Saudi listed stocks in the financial market"
            />
          </div>

          {/* Fund Manager Names - Side by side */}
          <div>
            <label className="block text-sm font-medium  mb-2">Fund Manager Name (Arabic)</label>
            <input
              type="text"
              name="fund_manager_name_ar"
              value={fundData.fund_manager_name_ar}
              onChange={handleFundChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 "
              placeholder="مدير الصندوق"
            />
          </div>
          <div>
            <label className="block text-sm font-medium  mb-2">Fund Manager Name (English)</label>
            <input
              type="text"
              name="fund_manager_name_en"
              value={fundData.fund_manager_name_en}
              onChange={handleFundChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 "
              placeholder="Fund Manager"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
