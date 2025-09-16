import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import { paymentAPI } from '../services/api';

const CreatePayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      setError('');
      const res = await paymentAPI.create(payload);
      // Expecting backend to return a redirect/link to payment page
      const redirectUrl = res.data?.data?.redirectUrl || res.data?.redirectUrl || '';
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      // Fallback: navigate to a demo payment page
      navigate(`/payment/${res.data?.data?.custom_order_id || 'demo-order'}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <PaymentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreatePayment;



