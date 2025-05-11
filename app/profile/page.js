'use client';
import { useState, useEffect, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { 
  ArrowLeftOnRectangleIcon, 
  KeyIcon,
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirm: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    savings: 0,
    monthlyAverage: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch user statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    // Fetch recent transactions
    const fetchRecentTransactions = async () => {
      try {
        const response = await fetch('/api/transactions/recent');
        if (response.ok) {
          const data = await response.json();
          setRecentTransactions(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchStats();
    fetchRecentTransactions();
  }, []);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Change password logic
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: '',
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password update failed');
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ newPassword: '', confirm: '' });
      setShowPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle notification preferences
  const handleNotificationSettings = async (settings) => {
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to update notification settings');
      setMessage({ type: 'success', text: 'Notification settings updated!' });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-28 pb-8 px-4">
      {/* Header */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 mb-4">
          <img
            src={user.image || '/default-avatar.png'}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="w-full max-w-sm mx-auto mt-6 bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-sm text-indigo-600">Total Expenses</p>
            <p className="text-xl font-bold text-indigo-900">${stats.totalExpenses}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-600">Total Income</p>
            <p className="text-xl font-bold text-green-900">${stats.totalIncome}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-600">Savings</p>
            <p className="text-xl font-bold text-blue-900">${stats.savings}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-purple-600">Monthly Average</p>
            <p className="text-xl font-bold text-purple-900">${stats.monthlyAverage}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="w-full max-w-sm mx-auto mt-6 bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <CreditCardIcon className={`w-5 h-5 ${
                    transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${
                transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}${transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Options List */}
      <div className="w-full max-w-sm mx-auto mt-6 bg-white rounded-2xl shadow divide-y divide-gray-100">
        <button onClick={() => setShowNotifications(true)} className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-50 focus:outline-none">
          <BellIcon className="h-5 w-5 mr-4 text-indigo-500" />
          <span>Notifications</span>
        </button>
        <button onClick={() => setShowSecurity(true)} className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-50 focus:outline-none">
          <ShieldCheckIcon className="h-5 w-5 mr-4 text-indigo-500" />
          <span>Security</span>
        </button>
        <button onClick={() => setShowPassword(true)} className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-50 focus:outline-none">
          <KeyIcon className="h-5 w-5 mr-4 text-indigo-500" />
          <span>Change Password</span>
        </button>
        <button onClick={() => setShowSettings(true)} className="flex items-center w-full px-6 py-4 text-gray-700 hover:bg-gray-50 focus:outline-none rounded-b-2xl">
          <Cog6ToothIcon className="h-5 w-5 mr-4 text-indigo-500" />
          <span>Settings</span>
        </button>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full max-w-sm mx-auto mt-8 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6 text-white" />
        Logout
      </button>

      {/* Change Password Modal */}
      {showPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  autoComplete="new-password"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {message.text && (
                <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {message.text}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowPassword(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">{loading ? 'Saving...' : 'Change'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4 text-center">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Transaction Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setShowNotifications(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
              <button type="button" onClick={() => setShowNotifications(false)} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurity && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4 text-center">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Login Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setShowSecurity(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
              <button type="button" onClick={() => setShowSecurity(false)} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4 text-center">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Currency</span>
                <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setShowSettings(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">Cancel</button>
              <button type="button" onClick={() => setShowSettings(false)} className="flex-1 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all duration-200">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 