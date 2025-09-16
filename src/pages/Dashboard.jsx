import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  School,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
    failed: 0,
    revenue: 0,
    schools: 0,
    students: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [transactionsResponse] = await Promise.all([
        transactionAPI.getAll({ limit: 5, page: 1, sort: 'payment_time', order: 'desc' })
      ]);

      const transactions = transactionsResponse.data?.data || transactionsResponse.data || [];
      setRecentTransactions(transactions);

      // Calculate stats (in a real app, you'd have dedicated endpoints for these)
      const total = transactionsResponse.data?.total ?? transactions.length;
      const success = transactions.filter(t => t.status === 'success').length;
      const pending = transactions.filter(t => t.status === 'pending').length;
      const failed = transactions.filter(t => t.status === 'failed').length;
      const revenue = transactions
        .filter(t => t.status === 'success')
        .reduce((sum, t) => sum + (t.transaction_amount || 0), 0);

      // Mock data for schools and students
      const schools = 12;
      const students = 2450;

      setStats({ total, success, pending, failed, revenue, schools, students });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, prefix = '' }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-black">{title}</p>
          <p className="text-2xl font-bold text-black">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusColors = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-black">Welcome to your school payment dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={CreditCard}
          title="Total Transactions"
          value={stats.total}
          color="text-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          title="Successful"
          value={stats.success}
          color="text-green-500"
        />
        <StatCard
          icon={Clock}
          title="Pending"
          value={stats.pending}
          color="text-yellow-500"
        />
        <StatCard
          icon={XCircle}
          title="Failed"
          value={stats.failed}
          color="text-red-500"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={stats.revenue}
          color="text-green-500"
          prefix="₹"
        />
        <StatCard
          icon={School}
          title="Schools"
          value={stats.schools}
          color="text-purple-500"
        />
        <StatCard
          icon={Users}
          title="Students"
          value={stats.students}
          color="text-indigo-500"
        />
      </div>

      {/* Revenue and Success Rate Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Total Revenue</p>
              <p className="text-3xl font-bold text-black">₹{stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="inline h-4 w-4 mr-1" />
                12% increase from last month
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div>
            <p className="text-sm font-medium text-black">Success Rate</p>
            <p className="text-3xl font-bold text-black">
              {stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
            </p>
            <p className="text-sm text-black mt-1">
              Based on {stats.total} total transactions
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Recent Transactions</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">School</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-black">
                    {transaction.custom_order_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    School {transaction.school_id?.slice(-4)}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    ₹{transaction.transaction_amount}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {transaction.payment_time ? new Date(transaction.payment_time).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentTransactions.length === 0 && (
          <div className="text-center py-8 text-black">
            No recent transactions found
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => window.location.href = '/create-payment'} className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black">
            <CreditCard className="h-5 w-5 mr-2" />
            Create Payment
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black">
            <CheckCircle className="h-5 w-5 mr-2" />
            Check Status
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black">
            <School className="h-5 w-5 mr-2" />
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;