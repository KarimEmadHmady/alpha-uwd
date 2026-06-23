'use client';

import React, { useState, useEffect } from 'react';
import { useFund } from '@/hooks/useFund';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const FundsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fundToDelete, setFundToDelete] = useState(null);
  const [draggedFund, setDraggedFund] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const { funds, getAllFunds, deleteFund, reorderFunds, isLoading, error, successMessage, clearError, clearSuccessMessage } = useFund();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      getAllFunds();
    }
  }, [token]);

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

  const handleDelete = async (fundId) => {
    setFundToDelete(fundId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (fundToDelete) {
      try {
        await deleteFund(fundToDelete);
        setDeleteModalOpen(false);
        setFundToDelete(null);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFundToDelete(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, fund, index) => {
    setDraggedFund({ ...fund, originalIndex: index });
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '';
    setDraggedFund(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedFund || draggedFund.originalIndex === dropIndex) return;
    
    const newFundsOrder = [...filteredFunds];
    newFundsOrder.splice(draggedFund.originalIndex, 1);
    newFundsOrder.splice(dropIndex, 0, draggedFund);
    
    const orderedIds = newFundsOrder.map(fund => fund.id);
    
    try {
      await reorderFunds(orderedIds);
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  const filteredFunds = Array.isArray(funds) ? funds.filter(fund =>
    fund.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.fund_manager_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getDisplayPrice = (fund) => {
    return fund?.status === 1 ? (fund?.newprice || '0.00') : (fund?.currentprice || '0.00');
  };

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00437a] to-blue-700 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Investment Funds</h1>
              <p className="text-blue-100">Manage and view all investment funds</p>
            </div>
            <Link
              href="/dashboard/add-fund"
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-[#00437a] font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add New Fund
            </Link>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-green-700">{successMessage}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search funds by name or manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>


        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
          </div>
        )}

        {/* Funds Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunds.map((fund, index) => (
              <div
                key={fund.id}
                draggable
                onDragStart={(e) => handleDragStart(e, fund, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`bg-white dark:bg-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-move ${
                  dragOverIndex === index ? 'ring-2 ring-blue-500 ring-opacity-50 transform scale-105' : ''
                } ${
                  draggedFund?.id === fund.id ? 'opacity-50' : ''
                }`}
              >
                {/* Fund Image */}
                <div className="h-48 bg-gradient-to-br from-[#00437a] to-blue-600 relative overflow-hidden">
                  {fund.image ? (
                    <img
                      src={fund.image}
                      alt={fund.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                    <p className="text-sm font-bold text-[#00437a]">
                      {fund.currency || 'EGP'} {getDisplayPrice(fund)}
                    </p>
                  </div>
                </div>

                {/* Fund Info */}
                <div className="p-6">
                  {/* Drag Handle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                      <span className="text-xs font-medium">DRAG TO REORDER</span>
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      #{index + 1}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold line-clamp-1">
                      {fund.name || 'Unnamed Fund'}
                    </h3>
                    {fund?.status === 0 && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full whitespace-nowrap">
                        PENDING
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                      {fund.fund_manager_name || 'Unknown Manager'}
                    </p>
                  </div>

                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {fund.type || 'General Fund'}
                    </p>
                  </div>

                  {/* Description */}
                  {fund.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {fund.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/edit-fund/${fund.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(fund.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredFunds.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No funds found' : 'No funds available'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first fund'}
            </p>
            {!searchTerm && (
              <Link
                href="/dashboard/add-fund"
                className="mt-4 inline-flex px-6 py-3 bg-[#00437a] text-white font-medium rounded-lg hover:bg-[#003560] transition-colors duration-200"
              >
                Add Your First Fund
              </Link>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Delete Fund
              </h3>
              
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this fund? <span className="font-bold">This action cannot be undone</span> and will permanently remove the fund from the system.
              </p>

              {/* Fund Info */}
              {fundToDelete && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium text-gray-700">
                    Fund: <span className="font-normal">
                      {funds.find(f => f.id === fundToDelete)?.name || 'Unknown Fund'}
                    </span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 cursor-pointer"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete Fund
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundsPage;
