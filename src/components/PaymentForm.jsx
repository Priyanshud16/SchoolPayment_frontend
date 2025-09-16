import { useState } from 'react';
import { School, User, Mail, CreditCard, Key, Link, Calendar } from 'lucide-react';

const PaymentForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    school_id: '',
    trustee_id: '',
    student_info: {
      name: '',
      id: '',
      email: ''
    },
    gateway_name: 'PhonePe',
    order_amount: '',
    // New fields
    pg_key: '', // You might want to get this from backend or set as default
    callback_url: '' // This might be set automatically
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('student_')) {
      const field = name.replace('student_', '');
      setFormData(prev => ({
        ...prev,
        student_info: {
          ...prev.student_info,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate timestamp and order_id on submit
    const timestamp = new Date().toISOString();
    const order_id = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    const submissionData = {
      ...formData,
      timestamp,
      order_id,
      // Ensure amount is a number
      order_amount: Number(formData.order_amount)
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Create New Payment
        </h2>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setFormData({
              school_id: '65b0e6293e9f76a9694d84b4',
              trustee_id: '65b0e552dd31950a9b41c5ba',
              student_info: {
                name: 'John Doe',
                id: 'STD-1001',
                email: 'john.doe@example.com'
              },
              gateway_name: 'PhonePe',
              order_amount: '2000',
              pg_key: 'edvtest01', // Demo pg_key
              callback_url: 'http://localhost:5000/api/payment/callback' // Demo callback
            })}
          >
            Use demo data
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              School Information
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  School ID
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="school_id"
                    required
                    className="input-field pl-10"
                    placeholder="Enter school ID"
                    value={formData.school_id}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trustee ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="trustee_id"
                    required
                    className="input-field pl-10"
                    placeholder="Enter trustee ID"
                    value={formData.trustee_id}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student Information
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  name="student_name"
                  required
                  className="input-field"
                  placeholder="Enter student name"
                  value={formData.student_info.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  name="student_id"
                  required
                  className="input-field"
                  placeholder="Enter student ID"
                  value={formData.student_info.id}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    name="student_email"
                    required
                    className="input-field pl-10"
                    placeholder="Enter student email"
                    value={formData.student_info.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gateway Information
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Gateway
                </label>
                <select
                  name="gateway_name"
                  className="input-field"
                  value={formData.gateway_name}
                  onChange={handleInputChange}
                >
                  <option value="PhonePe">PhonePe</option>
                  <option value="Paytm">Paytm</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Stripe">Stripe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  PG Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="pg_key"
                    required
                    className="input-field pl-10"
                    placeholder="Enter PG key"
                    value={formData.pg_key}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Callback URL
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="url"
                    name="callback_url"
                    required
                    className="input-field pl-10"
                    placeholder="Enter callback URL"
                    value={formData.callback_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Amount
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (₹)
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="order_amount"
                    required
                    min="1"
                    step="0.01"
                    className="input-field pl-10"
                    placeholder="Enter amount"
                    value={formData.order_amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? 'Processing...' : 'Create Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;