import { useState } from 'react';
import StatusCheck from '../components/StatusCheck';
import { transactionAPI } from '../services/api';

const CheckStatus = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = async (orderId) => {
    try {
      setLoading(true);
      setError('');
      setTransaction(null);
      
      const response = await transactionAPI.getStatus(orderId);
      setTransaction(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transaction status');
      console.error('Error checking status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check Transaction Status</h1>
        <p className="text-gray-600 dark:text-gray-400">Enter an order ID to check the status of a transaction</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <StatusCheck
        onCheckStatus={handleCheckStatus}
        loading={loading}
        transaction={transaction}
      />
    </div>
  );
};

export default CheckStatus;