'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { FiUser, FiMail, FiCalendar, FiDollarSign, FiCreditCard } from 'react-icons/fi';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
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

    if (session) {
      fetchStats();
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser className="h-12 w-12 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
              <p className="text-gray-500 mt-1">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FiMail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{session.user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiCalendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  Member since {format(new Date(session.user.createdAt || Date.now()), 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h2>
            {stats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiDollarSign className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600">Total Income</span>
                  </div>
                  <span className="text-lg font-semibold text-green-600">
                    ${stats.totalIncome.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiCreditCard className="h-5 w-5 text-red-500" />
                    <span className="text-gray-600">Total Expenses</span>
                  </div>
                  <span className="text-lg font-semibold text-red-600">
                    ${stats.totalExpenses.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiDollarSign className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">Savings</span>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    ${stats.savings.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Loading statistics...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 