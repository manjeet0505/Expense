'use client';
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
  CreditCardIcon,
  BanknotesIcon,
  CalendarIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserContext } from '../../context/UserContext';
import { useSession } from 'next-auth/react';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'expense',
    paymentMethod: 'Cash'
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [budgets, setBudgets] = useState([]);
  const { user } = useContext(UserContext);
  const { status } = useSession();
  const [stats, setStats] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);

  // Fetch stats and budget summary
  const fetchStatsAndBudget = async () => {
    try {
      const [statsRes, budgetRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/budget')
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (budgetRes.ok) setBudgetSummary(await budgetRes.json());
    } catch (error) {
      console.error('Error fetching stats/budget:', error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      setLoading(false);
      fetchStatsAndBudget();
    }
  }, [status, router]);

  // Real-time updates
  useEffect(() => {
    if (status === 'authenticated') {
      const interval = setInterval(fetchStatsAndBudget, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets');
      const data = await res.json();
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      });

      if (res.ok) {
        const newExpense = await res.json();
        setExpenses([newExpense, ...expenses]);
        setFormData({
          amount: '',
          category: '',
          description: '',
          type: 'expense',
          paymentMethod: 'Cash'
        });
        setShowAddForm(false);
        fetchStatsAndBudget(); // Re-fetch summary data
      } else {
        const error = await res.json();
        console.error('Error adding expense:', error);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setExpenses(expenses.filter(expense => expense._id !== id));
        fetchStatsAndBudget(); // Re-fetch summary data
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Use stats and budgetSummary for summary cards
  const totalBalance = stats?.totalBalance || 0;
  const totalIncome = stats?.totalIncome || 0;
  const totalExpenses = stats?.totalExpenses || 0;
  const monthlyBudget = budgetSummary?.amount || 0;
  const thisMonth = stats?.thisMonth || 0;

  const balance = totalIncome - totalExpenses;

  const statsData = [
    {
      title: "Total Balance",
      value: "$" + totalBalance.toFixed(2),
      change: "+12.5%",
      trend: "up",
      icon: <WalletIcon className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Monthly Income",
      value: "$" + totalIncome.toFixed(2),
      change: "+8.2%",
      trend: "up",
      icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Monthly Expenses",
      value: "$" + totalExpenses.toFixed(2),
      change: "-3.1%",
      trend: "down",
      icon: <ArrowTrendingDownIcon className="w-6 h-6" />,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Savings Rate",
      value: "32%",
      change: "+5.4%",
      trend: "up",
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      title: "Grocery Shopping",
      amount: -123.45,
      category: "Food",
      date: "2024-03-15",
      icon: <BanknotesIcon className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Salary Deposit",
      amount: 4567.89,
      category: "Income",
      date: "2024-03-14",
      icon: <CreditCardIcon className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Netflix Subscription",
      amount: -15.99,
      category: "Entertainment",
      date: "2024-03-13",
      icon: <CalendarIcon className="w-5 h-5" />
    }
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Category list for filter and chart
  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Income',
    'Other'
  ];

  // Filtered expenses
  const filteredExpenses = categoryFilter
    ? expenses.filter(e => e.category === categoryFilter)
    : expenses;

  // Chart data
  const expenseByCategory = categories.map(cat =>
    expenses.filter(e => e.category === cat && e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
  );
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses',
        data: expenseByCategory,
        backgroundColor: [
          '#6366f1', '#f59e42', '#f43f5e', '#10b981', '#fbbf24', '#3b82f6', '#a78bfa'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Budget tracker per category
  const budgetTrackers = budgets.map(budget => {
    const spent = expenses
      .filter(e => e.category === budget.category && e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    const percent = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
    return {
      ...budget,
      spent,
      percent,
    };
  });

  function exportToPDF(expenses) {
    console.log('Exporting PDF', expenses); // Debug log
    const doc = new jsPDF();
    doc.text('Expense Report', 14, 15);

    // टेबल के लिए हेडर और डाटा तैयार करें
    const tableColumn = ["No.", "Description", "Amount", "Category", "Date"];
    const tableRows = expenses.map((expense, idx) => [
      idx + 1,
      expense.description || '',
      `₹${expense.amount || ''}`,
      expense.category || '',
      expense.date ? expense.date.toString().slice(0, 10) : ''
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }, // Indigo
      styles: { fontSize: 10 },
    });

    doc.save('expenses.pdf');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-32 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Heading */}
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">Dashboard</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="ml-4 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg hover:from-indigo-600 hover:to-pink-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            + Add New Transaction
          </button>
        </div>

        {/* Export to PDF Button */}
        <button
          onClick={() => exportToPDF(filteredExpenses)}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
        >
          Export to PDF
        </button>

        {/* Category Filter & Chart */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <Doughnut data={chartData} />
          </div>
        </div>

        {/* Budget Tracker per Category */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Tracker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetTrackers.map(tracker => (
              <div key={tracker._id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{tracker.category}</span>
                  <span className="text-sm text-gray-500">{tracker.spent.toFixed(2)} / {tracker.amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      tracker.percent > 100 ? 'bg-red-500' : tracker.percent > 80 ? 'bg-yellow-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${tracker.percent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(tracker.percent)}% used</div>
              </div>
            ))}
            {budgetTrackers.length === 0 && (
              <div className="text-gray-500">No budgets set yet.</div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Add Expense Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Expense
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Transaction</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddExpense} className="space-y-4">
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
                    <option value="Income">Income</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
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
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredExpenses.map((expense) => (
              <div key={expense._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      expense.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {expense.type === 'income' ? (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className={`text-sm font-medium ${
                      expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {expense.type === 'income' ? '+' : '-'}${Math.abs(expense.amount).toFixed(2)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 