'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiUser, FiSettings, FiLogOut, FiCreditCard, FiBell, FiHelpCircle, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';
import AccountOverview from '../components/AccountOverview';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats
        const statsResponse = await fetch('/api/stats');
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json();
          console.error('Stats API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch stats');
        }
        const statsData = await statsResponse.json();
        console.log('Stats data:', statsData);
        setStats(statsData);

        // Fetch recent transactions
        const transactionsResponse = await fetch('/api/transactions/recent');
        if (!transactionsResponse.ok) {
          const errorData = await transactionsResponse.json();
          console.error('Transactions API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }
        const transactionsData = await transactionsResponse.json();
        console.log('Transactions data:', transactionsData);
        setRecentTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <AccountOverview />;

      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Email Notifications</h3>
                <p className="text-sm text-gray-600 mb-4">Manage your email notification preferences</p>
                <button className="text-blue-600 hover:text-blue-700">Configure</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Security Settings</h3>
                <p className="text-sm text-gray-600 mb-4">Update your password and security preferences</p>
                <button className="text-blue-600 hover:text-blue-700">Update</button>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">FAQs</h3>
                <p className="text-sm text-gray-600 mb-4">Find answers to common questions</p>
                <button className="text-blue-600 hover:text-blue-700">View FAQs</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 mb-4">Get help from our support team</p>
                <button className="text-blue-600 hover:text-blue-700">Contact Us</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
                <p className="text-gray-600">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Sidebar */}
            <div className="md:col-span-1 border-r">
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                        activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <FiCreditCard className="h-5 w-5" />
                      <span>Overview</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                        activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <FiSettings className="h-5 w-5" />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('help')}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                        activeTab === 'help' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <FiHelpCircle className="h-5 w-5" />
                      <span>Help & Support</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 p-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 