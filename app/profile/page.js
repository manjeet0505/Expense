'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  // Set up real-time updates
  useEffect(() => {
    if (session) {
      // Fetch stats every 30 seconds
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {getInitials(session.user.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
              <p className="text-gray-500 mt-1">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Income Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Income</h3>
              <FiTrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${stats?.totalIncome.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Expenses</h3>
              <FiTrendingDown className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              ${stats?.totalExpenses.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>

          {/* Savings Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Savings</h3>
              <FiDollarSign className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              ${stats?.savings.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
} 