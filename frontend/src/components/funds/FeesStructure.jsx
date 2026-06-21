'use client';

import React from 'react';

const FeesStructure = ({ fundData, handleFundChange }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Fees Structure</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Fee */}
        <div>
          <label className="block text-sm font-medium  mb-2">Subscription Fee </label>
          <input
            type="text"
            step="0.001"
            name="subscription_fee"
            value={fundData.subscription_fee}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Subscription Fee (Arabic)</label>
          <input
            type="text"
            name="subscription_fee_ar"
            value={fundData.subscription_fee_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="واحد في المئة"
          />
        </div>

        {/* Redemption Fee */}
        <div>
          <label className="block text-sm font-medium  mb-2">Redemption Fee </label>
          <input
            type="text"
            step="0.001"
            name="redemption_fee"
            value={fundData.redemption_fee}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="0.005"
          />
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Redemption Fee (Arabic)</label>
          <input
            type="text"
            name="redemption_fee_ar"
            value={fundData.redemption_fee_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="نصف في المئة"
          />
        </div>

        {/* Annual Fee */}
        <div>
          <label className="block text-sm font-medium  mb-2">Annual Fee </label>
          <input
            type="text"
            step="0.001"
            name="annualfee"
            value={fundData.annualfee}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="0.02"
          />
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Annual Fee (Arabic)</label>
          <input
            type="text"
            name="annualfee_ar"
            value={fundData.annualfee_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="اثنين في المئة"
          />
        </div>
      </div>
    </div>
  );
};

export default FeesStructure;
