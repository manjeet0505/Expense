'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  XMarkIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function BudgetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7),
    notes: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets');
      const data = await res.json();
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses?limit=1000');
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const checkBudgetAlerts = useCallback(() => {
    const newAlerts = budgets
      .map(budget => {
        const spent = expenses
          .filter(e =>
            e.category === budget.category &&
            e.type === 'expense' &&
            new Date(e.date).getMonth() === new Date(budget.month).getMonth() &&
            new Date(e.date).getFullYear() === new Date(budget.month).getFullYear()
          )
          .reduce((sum, e) => sum + e.amount, 0);
        const spentPercentage = (spent / budget.amount) * 100;
        if (spentPercentage >= 80 && spentPercentage < 100) {
          return {
            id: budget._id,
            category: budget.category,
            spent,
            amount: budget.amount,
            percentage: Math.round(spentPercentage)
          };
        }
        return null;
      })
      .filter(Boolean);
    setAlerts(newAlerts);
  }, [budgets, expenses]);

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  useEffect(() => {
    checkBudgetAlerts();
  }, [checkBudgetAlerts]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newBudget = await res.json();
        setBudgets([...budgets, newBudget]);
        setFormData({
          category: '',
          amount: '',
          month: new Date().toISOString().slice(0, 7),
          notes: ''
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Update budget tracker logic
  const budgetTrackers = budgets.map(budget => {
    const spent = expenses
      .filter(e =>
        e.category === budget.category &&
        e.type === 'expense' &&
        new Date(e.date).getMonth() === new Date(budget.month).getMonth() &&
        new Date(e.date).getFullYear() === new Date(budget.month).getFullYear()
      )
      .reduce((sum, e) => sum + e.amount, 0);
    const percent = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
    return {
      ...budget,
      spent,
      percent,
    };
  });

  // Calculate total spent, total budget, and remaining using budgetTrackers
  const totalSpent = budgetTrackers.reduce((sum, b) => sum + b.spent, 0);
  const totalBudget = budgetTrackers.reduce((sum, b) => sum + b.amount, 0);
  const remaining = totalBudget - totalSpent;

  const summary = [
    {
      icon: <CurrencyDollarIcon className="w-8 h-8 text-indigo-500" />,
      label: 'Total Budget',
      value: `$${totalBudget.toFixed(2)}`,
      color: '#4F46E5'
    },
    {
      icon: <ArrowTrendingDownIcon className="w-8 h-8 text-pink-500" />,
      label: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      color: '#EC4899'
    },
    {
      icon: <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />,
      label: 'Remaining',
      value: `$${remaining.toFixed(2)}`,
      color: '#10B981'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-32 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Heading */}
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">Budget Manager</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="ml-4 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:from-indigo-600 hover:to-pink-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            + Add New Budget
          </button>
        </div>

        {/* Budget Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Budget Alerts</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {alerts.map(alert => (
                        <li key={alert.id}>
                          {alert.category} budget is at {alert.percentage}% (${alert.spent.toFixed(2)} of ${alert.amount.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Summary Cards */}
          {summary.map((item, idx) => (
            <motion.div
              key={idx}
              className="card-glass rounded-2xl shadow-xl p-8 flex flex-col items-center border border-indigo-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.04, boxShadow: '0 8px 32px 0 #a5b4fc' }}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <div className="text-lg font-semibold text-gray-700 mb-2">{item.label}</div>
              <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Add Budget Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Budget
          </button>
        </div>

        {/* Add Budget Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Budget</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Month</label>
                  <input
                    type="month"
                    name="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Budgets List */}
        <motion.div className="card-glass rounded-2xl shadow-xl p-8 border border-indigo-100" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">Monthly Budgets</h2>
          {budgets.length === 0 ? (
            <p className="text-gray-500">No budgets found.</p>
          ) : (
            <ul className="divide-y divide-indigo-50">
              {budgets.map((budget, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center justify-between py-6 group hover:bg-indigo-50/40 rounded-xl transition-all duration-300"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: '0 4px 24px 0 #a5b4fc' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full group-hover:bg-pink-100 transition-colors duration-300">
                      <ChartBarIcon className="w-6 h-6 text-indigo-500 group-hover:text-pink-500 transition-colors duration-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">{budget.category}</div>
                      <div className="text-gray-500 text-sm">{budget.month}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${budget.amount.toFixed(2)}</div>
                    <div className="text-gray-500 text-sm">Spent: <span className="text-pink-500 font-bold">${budget.spent.toFixed(2)}</span></div>
                    <div className="h-1 w-24 bg-pink-200 rounded-full mt-2">
                      <div className="h-1 rounded-full bg-pink-500" style={{ width: `${Math.min(100, (budget.spent / budget.amount) * 100)}%` }}></div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
} 