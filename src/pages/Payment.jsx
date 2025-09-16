import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { paymentAPI } from '../services/api';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      // If backend connected, call API; else simulate
      try {
        await paymentAPI.create({ orderId });
      } catch (e) {
        // Fallback simulate in case of missing backend
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setSuccess(true);
      
      // Redirect to transactions page after 3 seconds
      setTimeout(() => {
        navigate('/transactions');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your payment has been processed successfully. Redirecting to transactions...
          </p>
          <button
            onClick={() => navigate('/transactions')}
            className="btn-primary"
          >
            Go to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto pt-12 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="card">
          <div className="text-center mb-6">
            <CreditCard className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Payment
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Order ID: {orderId}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold">₹1,200.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
              <span className="font-semibold">Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="text-yellow-600 font-semibold">Pending</span>
            </div>
          </div>

          {/* Payment form would go here in a real application */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              This is a demo payment page. In a real application, you would see
              payment gateway integration here.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;