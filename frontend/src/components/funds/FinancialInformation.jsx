'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';

const FinancialInformation = ({ fundData, handleFundChange }) => {
  const { showSuccess } = useToast();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleFundChange(e);
    
    // Show toast for important fields
    if (name === 'currency' || name === 'currency_ar') {
      showSuccess(`Currency updated to ${value}`);
    }
  };
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold  mb-4 pb-2 border-b">Financial Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency */}
        <div>
          <label className="block text-sm font-medium  mb-2">Currency (English)</label>
          <select
            name="currency"
            value={fundData.currency}
            onChange={handleFieldChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
          >
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="SAR">SAR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Currency (Arabic)</label>
          <input
            type="text"
            name="currency_ar"
            value={fundData.currency_ar}
            onChange={handleFieldChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="جنيه مصري"
          />
        </div>

        {/* Minimum Investment */}
        <div>
          <label className="block text-sm font-medium  mb-2">Minimum Initial Investment</label>
          <input
            type="number"
            name="minimum_initial"
            value={fundData.minimum_initial}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Minimum Initial Investment (Arabic)</label>
          <input
            type="text"
            name="minimum_initial_ar"
            value={fundData.minimum_initial_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="ألف جنيه"
          />
        </div>

        {/* Redemption Amount */}
        <div>
          <label className="block text-sm font-medium  mb-2">Minimum Redemption Amount</label>
          <input
            type="number"
            name="Minimum_redemption_amount"
            value={fundData.Minimum_redemption_amount}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium  mb-2">Minimum Redemption Amount (Arabic)</label>
          <input
            type="text"
            name="Minimum_redemption_amount_ar"
            value={fundData.Minimum_redemption_amount_ar}
            onChange={handleFundChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            placeholder="مئة جنيه"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialInformation;
