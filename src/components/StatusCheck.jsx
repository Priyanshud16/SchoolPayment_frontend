import { useState } from 'react';
import { Search, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusCheck = ({ onCheckStatus, loading, transaction }) => {
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      onCheckStatus(orderId.trim());
    }
  };

  const StatusDisplay = () => {
    if (!transaction) return null;

    const statusConfig = {
      success: {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-100'
      },
      pending: {
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-100'
      },
      failed: {
        icon: XCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-100'
      }
    };

    const config = statusConfig[transaction.status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transaction Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Information</h4>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-300">Order ID</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">{transaction.custom_order_id}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-300">Order Amount</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">₹{transaction.order_amount}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-300">Transaction Amount</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">₹{transaction.transaction_amount}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status Information</h4>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-300">Status</dt>
                <dd className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <span className={`text-sm font-medium ${config.text}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </dd>
              </div>
              {transaction.payment_time && (
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-300">Payment Time</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(transaction.payment_time).toLocaleString()}
                  </dd>
                </div>
              )}
              {transaction.error_message && transaction.error_message !== 'NA' && (
                <div>
                  <dt className="text-sm text-gray-600 dark:text-gray-300">Error Message</dt>
                  <dd className="text-sm font-medium text-red-600 dark:text-red-400">
                    {transaction.error_message}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Check Transaction Status
        </h2>
        
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                id="orderId"
                placeholder="Enter order ID"
                className="input-field pl-10"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
          </div>
          
          <div className="self-end">
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="btn-primary"
            >
              {loading ? 'Checking...' : 'Check Status'}
            </button>
          </div>
        </form>
      </div>

      <StatusDisplay />

      {!transaction && !loading && (
        <div className="card mt-6">
          <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">Enter an order ID to check transaction status</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheck;