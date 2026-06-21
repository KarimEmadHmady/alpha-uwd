'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useFund } from '@/hooks/useFund';
import { useCategory } from '@/hooks/useCategory';
import { usersService } from '@/services/usersService';
import { useAuth } from '@/hooks/useAuth';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Link from "next/link";
import ApexCharts from 'apexcharts';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Type definitions
interface Fund {
  id: number;
  name: string;
  status: number;
  [key: string]: any;
}

interface Category {
  id: number;
  name: string;
  funds_count?: number;
  [key: string]: any;
}

interface User {
  id: number;
  name: string;
  [key: string]: any;
}

const DashboardPage = () => {
  const { token } = useAuth();
  const { funds, getAllFunds, getWaitingFunds, declineFund } = useFund();
  const { categories, getCategoriesWithTranslations } = useCategory();

  const [users, setUsers] = useState<User[]>([]);
  const [waitingFunds, setWaitingFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; fundId: number | null; message: string }>({
    isOpen: false,
    fundId: null,
    message: ''
  });
  const [stats, setStats] = useState({
    totalFunds: 0,
    totalUsers: 0,
    totalCategories: 0,
    waitingApproval: 0,
    approvedFunds: 0,
    rejectedFunds: 0,
  });

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const [usersData, waitingFundsData] = await Promise.all([
        usersService.getAllUsers(token),
        getWaitingFunds('en').catch(() => [])
      ]);

      console.log('Users data:', usersData);
      console.log('Waiting funds data:', waitingFundsData);
      console.log('Funds:', funds);
      console.log('Categories:', categories);

      // Handle different response structures
      let usersArray = [];
      if (usersData.users && Array.isArray(usersData.users)) {
        usersArray = usersData.users;
      } else if (Array.isArray(usersData)) {
        usersArray = usersData;
      } else if (usersData.data && Array.isArray(usersData.data)) {
        usersArray = usersData.data;
      }

      console.log('Processed users array:', usersArray);
      setUsers(usersArray);
      setWaitingFunds(waitingFundsData);

      // Calculate stats
      const newStats = {
        totalFunds: funds.length,
        totalUsers: usersArray.length,
        totalCategories: categories.length,
        waitingApproval: waitingFundsData.length,
        approvedFunds: funds.filter((f: Fund) => f.status === 1).length,
        rejectedFunds: funds.filter((f: Fund) => f.status === 0).length,
      };

      console.log('New stats:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getAllFunds();
      getCategoriesWithTranslations(token);
    }
  }, [token]);

  // Fetch dashboard data when funds and categories are loaded
  useEffect(() => {
    console.log('Dashboard data check:', { fundsLength: funds.length, categoriesLength: categories.length, token: !!token });
    if (token && funds.length > 0) {
      fetchDashboardData();
    }
  }, [token, funds]);

  // Handle reject modal
  const handleRejectClick = (fundId: number) => {
    setRejectModal({ isOpen: true, fundId, message: '' });
  };

  const handleRejectSubmit = async () => {
    try {
      await declineFund(rejectModal.fundId, rejectModal.message);
      // Close modal immediately after successful submission
      setRejectModal({ isOpen: false, fundId: null, message: '' });
      // Refresh data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting fund:', error);
    }
  };

  const handleRejectCancel = () => {
    setRejectModal({ isOpen: false, fundId: null, message: '' });
  };

  // Chart configurations
  const fundStatusChart = {
    series: [stats.approvedFunds, stats.waitingApproval, stats.rejectedFunds],
    options: {
      chart: {
        type: 'donut' as const,
        height: 300,
      },
      labels: ['Approved', 'Waiting Approval', 'Rejected'],
      colors: ['#10B981', '#F59E0B', '#EF4444'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Funds',
                formatter: () => stats.totalFunds.toString(),
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Calculate fund counts dynamically from funds data
  const categoryData = categories.slice(0, 5).map((cat: Category) => {
    const fundCount = funds.filter((fund: Fund) => fund.catid === cat.id).length;
    console.log(`Category "${cat.name}" (ID: ${cat.id}) has ${fundCount} funds`);
    return {
      name: cat.name || 'Unknown',
      count: fundCount
    };
  });


  const categoryDistributionChart = {
    series: [{
      name: 'Funds',
      data: categoryData.map((item: { name: string, count: number }) => item.count)
    }],
    options: {
      chart: {
        type: 'bar' as const,
        height: 300,
      },
      xaxis: {
        categories: categoryData.map((item: { name: string, count: number }) => item.name),
      },
      yaxis: {
        title: {
          text: 'Number of Funds',
        },
      },
      dataLabels: {
        enabled: true,
      },
      colors: ['#3B82F6'],
    },
  };

  const userGrowthChart = {
    series: [{
      name: 'Users',
      data: users.slice(-7).map((_: User, index: number) => Math.floor(Math.random() * 10) + 5),
    }],
    options: {
      chart: {
        type: 'area' as const,
        height: 300,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2,
      },
      fill: {
        type: 'gradient' as const,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        },
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yaxis: {
        title: {
          text: 'New Users',
        },
      },
      colors: ['#8B5CF6'],
    },
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
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-blue-100">Overview of your investment fund management system</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Funds */}
        <Link href="/dashboard/funds">
          <div className="cursor-pointer bg-white dark:bg-white/10 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm text-gray-700 dark:text-white  text-gray-700 dark:text-white ">Total Funds</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-white  ">{stats.totalFunds}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Total Users */}
        <Link href="/dashboard/users">
          <div className="cursor-pointer bg-white dark:bg-white/10 rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm text-gray-700 dark:text-white ">Total Users</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-white ">{stats.totalUsers}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Categories */}
        <Link href="/dashboard/category">
          <div className="cursor-pointer bg-white dark:bg-white/10 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-white ">Categories</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-white  ">{stats.totalCategories}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Pending Approval */}
        <Link href="/dashboard/waiting-approve">
          <div className="cursor-pointer bg-white dark:bg-white/10 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm text-gray-700 dark:text-white ">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-white ">{stats.waitingApproval}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Status Chart */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <h3 className="text-lg text-gray-700 dark:text-white font-semibold  mb-4">Fund Status Distribution</h3>
          <Chart options={fundStatusChart.options} series={fundStatusChart.series} type="donut" height={300} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold  mb-4">Funds by Category</h3>
          <Chart
            options={categoryDistributionChart.options}
            series={categoryDistributionChart.series}
            type="bar"
            height={300}
          />
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold  mb-4">User Growth (Last 7 Days)</h3>
          <Chart options={userGrowthChart.options} series={userGrowthChart.series} type="area" height={300} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold  mb-4">Recent Activity</h3>
          <RecentActivity />
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Fund</h3>
            <textarea
              value={rejectModal.message}
              onChange={(e) => setRejectModal({ ...rejectModal, message: e.target.value })}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleRejectCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
