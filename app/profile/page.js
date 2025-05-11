'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser } from 'react-icons/fi';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [budget, setBudget] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(6000); // Example static goal

  // Fetch stats and budget
  const fetchData = async () => {
    try {
      const [statsRes, budgetRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/budget')
      ]);
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (budgetRes.ok) {
        setBudget(await budgetRes.json());
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  // Real-time updates
  useEffect(() => {
    if (session) {
      const interval = setInterval(fetchData, 30000);
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

  // Avatar logic
  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase();
  const avatar = session.user.image ? (
    <img src={session.user.image} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
  ) : (
    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
      {getInitials(session.user.name)}
    </div>
  );

  // Financial summary
  const totalBalance = stats?.totalBalance || 0;
  const monthlyBudget = budget?.amount || 0;
  const thisMonth = stats?.thisMonth || 0;
  const budgetPercent = monthlyBudget ? Math.min(100, Math.round((thisMonth / monthlyBudget) * 100)) : 0;

  // Savings goal progress
  const savings = stats?.savings || 0;
  const savingsPercent = savingsGoal ? Math.min(100, Math.round((savings / savingsGoal) * 100)) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8">
          {avatar}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.user.name}</h1>
            <p className="text-gray-500 mt-1">{session.user.email}</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mb-8 border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
          <div className="flex justify-between items-end mb-2">
            <div className="text-center flex-1">
              <div className="text-xs text-gray-500 mb-1">Total Balance</div>
              <div className="text-2xl font-bold text-gray-800">${totalBalance.toLocaleString()}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xs text-gray-500 mb-1">Monthly Budget</div>
              <div className="text-2xl font-bold text-gray-800">${monthlyBudget.toLocaleString()}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xs text-gray-500 mb-1">This Month</div>
              <div className="text-2xl font-bold text-gray-800">${thisMonth.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${budgetPercent}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">{budgetPercent}% of budget spent</div>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="mb-8 border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Savings Goals</h2>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-700">Emergency Fund</div>
            <div className="font-bold text-gray-800">${savingsGoal.toLocaleString()}</div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${savingsPercent}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{savingsPercent}% of goal reached</div>
        </div>

        {/* Settings */}
        <div className="border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Currency</span>
              <span className="text-gray-500">USD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Dark Mode</span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Notifications</span>
              <span className="text-gray-400">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 