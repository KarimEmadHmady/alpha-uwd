'use client';

import React from 'react';

const PriceManagement = ({ 
  priceData, 
  priceHistory, 
  fund, 
  handlePriceSubmit, 
  handlePriceChange, 
  isLoading 
}) => {
  // Helper function to fix timezone
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold  mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-[#00437a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Price Management
      </h2>
      
      <form onSubmit={handlePriceSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Price - From fund data */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              Current Price
            </label>
            <input
              type="number"
              step="0.01"
              name="currentprice"
              value={fund?.status === 1 ? (fund?.newprice || priceData.currentprice || '') : (fund?.currentprice || priceData.currentprice || '')}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none cursor-not-allowed"
              placeholder="Enter current price"
            />
          </div>
          
          {/* New Price - Required */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              New Price *
            </label>
            <input
              type="number"
              step="0.01"
              name="newprice"
              value={priceData.newprice}
              onChange={handlePriceChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
              placeholder="Enter new price"
            />
          </div>
          

{/* Date - Pre-filled with today's date */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Update Date
            </label>
            <input
              type="date"
              name="date"
              value={priceData.date || getTodayDate()}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
            />
          </div>
        </div>
        
        {/* Price History */}
        <div className=" rounded-lg p-4">
          <h3 className="text-sm font-medium  mb-2">Price History</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">
              Latest Update: <span className="font-medium">
                {formatDateForInput(priceHistory.latest?.date) || 'No previous updates'}
              </span>
            </p>
            <p className="text-sm text-gray-400">
              Previous Update: <span className="font-medium">
                {formatDateForInput(priceHistory.previous?.date) || 'No previous updates'}
              </span>
            </p>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-[#00437a] to-blue-700  text-white font-medium rounded-lg hover:bg-[#003560] transition-colors duration-200 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Updating...' : 'Update Price'}
        </button>
      </form>
    </div>
  );
};

export default PriceManagement;