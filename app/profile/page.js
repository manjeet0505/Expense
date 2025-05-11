'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { FiUser, FiMail, FiCalendar, FiDollarSign, FiCreditCard, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, transactionsResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/transactions/recent')
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setRecentTransactions(transactionsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <FiTrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <FiTrendingDown className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 