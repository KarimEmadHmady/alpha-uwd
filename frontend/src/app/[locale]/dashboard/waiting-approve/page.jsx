'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFund } from '@/hooks/useFund';
import { useUsers } from '@/hooks/useUsers';

const WaitingApprovePage = () => {
  const {
    getWaitingFunds,
    updateFundStatus,
    declineFund,
    getFundPriceHistory,
    isLoading,
    error,
    successMessage,
    clearError,
    clearSuccessMessage
  } = useFund();

  const { fetchUserById } = useUsers();

  const [funds, setFunds] = useState([]);
  const [fundsWithUsers, setFundsWithUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, fundId: null, message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [countdown, setCountdown] = useState(120);
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Helper function to format date
  const formatDateForInput = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  // Fetch user details for each fund
  const fetchUsersForFunds = async (fundsData) => {
    try {
      const fundsWithUserPromises = fundsData.map(async (fund) => {
        try {
          const priceHistory = await getFundPriceHistory(fund.id);
          const userId = priceHistory?.latest?.userid;
          const latestDate = priceHistory?.latest?.date || null;
          const previousDate = priceHistory?.previous?.date || null;

          if (userId) {
            try {
              const API_URL = process.env.NEXT_PUBLIC_API_URL;
              const token = localStorage.getItem('auth_token');

              const usersResponse = await fetch(`${API_URL}/api/users`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (!usersResponse.ok) {
                const errorData = await usersResponse.json();
                console.error('Users API error:', errorData);
                throw new Error(errorData.message || 'Failed to fetch users');
              }

              const usersData = await usersResponse.json();

              const user = usersData?.users?.find(u => u.id === parseInt(userId)) ||
                usersData?.find(u => u.id === parseInt(userId)) ||
                usersData?.payload?.users?.find(u => u.id === parseInt(userId));

              const userName = user?.name || user?.username || user?.email || 'Unknown User';

              return {
                ...fund,
                lastUpdateUser: userName,
                lastUpdateUserId: userId,
                latestDate,
                previousDate
              };
            } catch (userErr) {
              console.error('Error fetching user details:', userErr);
              return {
                ...fund,
                lastUpdateUser: 'Unknown User',
                lastUpdateUserId: userId,
                latestDate,
                previousDate
              };
            }
          }

          return {
            ...fund,
            lastUpdateUser: 'Unknown User',
            lastUpdateUserId: null,
            latestDate,
            previousDate
          };
        } catch (err) {
          console.error('Error fetching user for fund:', fund.id, err);
          return {
            ...fund,
            lastUpdateUser: 'Unknown User',
            lastUpdateUserId: null,
            latestDate: null,
            previousDate: null
          };
        }
      });

      const enrichedFunds = await Promise.all(fundsWithUserPromises);
      setFundsWithUsers(enrichedFunds);
    } catch (error) {
      console.error('Error fetching users for funds:', error);
      setFundsWithUsers(fundsData);
    }
  };

  // Fetch funds with status 0
  const fetchWaitingFunds = async () => {
    try {
      const fundsData = await getWaitingFunds('en');
      setFunds(fundsData);
      await fetchUsersForFunds(fundsData);
    } catch (error) {
      console.error('Error fetching waiting funds:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWaitingFunds();
    resetAutoRefresh();
  };

  // Reset auto-refresh timer
  const resetAutoRefresh = () => {
    setCountdown(120);

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    intervalRef.current = setInterval(() => {
      handleRefresh();
    }, 120000);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 120;
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    fetchWaitingFunds();
    resetAutoRefresh();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Approve fund
  const handleApprove = async (fundId) => {
    setApproving(fundId);
    try {
      await updateFundStatus(fundId, 1);
      setSuccessModal({ isOpen: true, message: 'Fund approved successfully!' });
      setTimeout(() => closeSuccessModal(), 2000);
      setTimeout(() => handleRefresh(), 500);
    } catch (error) {
      console.error('Error approving fund:', error);
    } finally {
      setApproving(null);
    }
  };

  const closeSuccessModal = () => setSuccessModal({ isOpen: false, message: '' });
  const openRejectModal = (fundId) => setRejectModal({ isOpen: true, fundId, message: '' });
  const closeRejectModal = () => setRejectModal({ isOpen: false, fundId: null, message: '' });

  // Reject fund
  const handleReject = async () => {
    setRejecting(true);
    try {
      await declineFund(rejectModal.fundId, rejectModal.message);
      setSuccessModal({ isOpen: true, message: 'Fund rejected successfully!' });
      setTimeout(() => closeSuccessModal(), 2000);
    } catch (error) {
      console.error('Error rejecting fund:', error);
    } finally {
      setRejecting(false);
      closeRejectModal();
      handleRefresh();
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00437a] to-blue-700 rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">Waiting Approval</h1>
            <p className="text-blue-100">Manage and view all investment funds</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center space-y-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full px-6 py-3 bg-white text-[#00437a] rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
              <span className="font-medium">Next refresh in: </span>
              <span className="font-bold">{formatCountdown(countdown)}</span>
            </div>
          </div>
        </div>
      </div>

      {fundsWithUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No funds waiting for approval</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundsWithUsers.map((fund) => (
            <div key={fund.id} className="bg-white rounded-xl shadow-lg p-6">
              {/* Fund Image and Name */}
              <div className="mb-4">
                <img src={fund.image} alt={fund.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                <h3 className="font-semibold text-gray-900 text-center">{fund.name}</h3>
              </div>

              {/* Price History */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <h4 className="text-sm font-semibold text-blue-900">Price History</h4>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Current Price:</span>
                    <span className="text-sm font-bold text-gray-900">{fund.currentprice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">New Price:</span>
                    <span className="text-sm font-bold text-green-600">{fund.newprice}</span>
                  </div>

                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="flex items-center mb-1">
                          <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-xs font-medium text-blue-700">New Update:</span>
                        </div>
                        {/* ✅ التاريخ من priceHistory.latest.date */}
                        <p className="text-sm font-semibold text-blue-900 ml-5">
                          {formatDateForInput(fund.latestDate)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center mt-2">
                          <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <span className="text-xs font-medium text-blue-700">Updated by:</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-900 ml-5">
                          {fund.lastUpdateUser}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-xs font-medium text-gray-600">Previous Update:</span>
                  </div>
                  {/* ✅ التاريخ من priceHistory.previous.date */}
                  <p className="text-sm font-semibold text-gray-700 ml-5">
                    {formatDateForInput(fund.previousDate)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(fund.id)}
                  disabled={approving === fund.id}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {approving === fund.id ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Approving...
                    </>
                  ) : <>✅ Approve</>}
                </button>
                <button
                  onClick={() => openRejectModal(fund.id)}
                  disabled={approving === fund.id || rejecting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {rejecting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rejecting...
                    </>
                  ) : <>❌ Reject</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Fund</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectModal.message}
              onChange={(e) => setRejectModal({ ...rejectModal, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleReject}
                disabled={!rejectModal.message.trim() || rejecting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              >
                {rejecting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Rejecting...
                  </>
                ) : 'Reject'}
              </button>
              <button
                onClick={closeRejectModal}
                disabled={rejecting}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successModal.message}</p>
            </div>
            <button
              onClick={closeSuccessModal}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingApprovePage;