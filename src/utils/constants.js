export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const TRANSACTION_STATUS_COLORS = {
  [TRANSACTION_STATUS.SUCCESS]: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-100',
    icon: 'text-green-500'
  },
  [TRANSACTION_STATUS.PENDING]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    text: 'text-yellow-800 dark:text-yellow-100',
    icon: 'text-yellow-500'
  },
  [TRANSACTION_STATUS.FAILED]: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-100',
    icon: 'text-red-500'
  },
  [TRANSACTION_STATUS.REFUNDED]: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-100',
    icon: 'text-blue-500'
  }
};

export const PAYMENT_GATEWAYS = [
  { id: 'phonepe', name: 'PhonePe', enabled: true },
  { id: 'paytm', name: 'Paytm', enabled: true },
  { id: 'razorpay', name: 'Razorpay', enabled: true },
  { id: 'stripe', name: 'Stripe', enabled: true }
];

export const SCHOOLS = [
  { 
    id: '65b0e6293e9f76a9694d84b4', 
    name: 'Springfield Elementary School', 
    code: 'SPFE',
    address: '123 Main St, Springfield',
    contact: '555-0123'
  },
  { 
    id: '65b0e6293e9f76a9694d84b5', 
    name: 'Shelbyville High School', 
    code: 'SHHS',
    address: '456 Oak Ave, Shelbyville',
    contact: '555-0456'
  },
  { 
    id: '65b0e6293e9f76a9694d84b6', 
    name: 'Ogdenville Academy', 
    code: 'OGA',
    address: '789 Pine Rd, Ogdenville',
    contact: '555-0789'
  },
  { 
    id: '65b0e6293e9f76a9694d84b7', 
    name: 'North Haverbrook Institute', 
    code: 'NHI',
    address: '101 Maple Blvd, North Haverbrook',
    contact: '555-1011'
  }
];

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'desc'
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  RECENT_SEARCHES: 'recent_searches'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

export const SUCCESS_MESSAGES = {
  PAYMENT_SUCCESS: 'Payment processed successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  DATA_SAVED: 'Data saved successfully.'
};