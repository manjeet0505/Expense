import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function AccountOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

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
        setStats(statsData);

        // Fetch recent transactions
        const transactionsResponse = await fetch('/api/transactions/recent');
        if (!transactionsResponse.ok) {
          const errorData = await transactionsResponse.json();
          console.error('Transactions API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Account Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Expenses</p>
            <p className="text-2xl font-bold">${stats?.totalExpenses || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Total Income</p>
            <p className="text-2xl font-bold">${stats?.totalIncome || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Savings</p>
            <p className="text-2xl font-bold">${stats?.savings || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600">Monthly Average</p>
            <p className="text-2xl font-bold">${stats?.monthlyAverage || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 