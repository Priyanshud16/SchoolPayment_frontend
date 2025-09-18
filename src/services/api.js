// src/services/api.js
import axios from 'axios';
import { authAPI as demoAuthAPI } from './auth'; // import demo auth

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IS_DEMO = !API_BASE_URL; // demo mode if no API configured

// Axios instance for real API
const api = axios.create({
  baseURL: API_BASE_URL || '/',
});

// Attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      console.warn('Unauthorized request - token removed');
    }
    return Promise.reject(error);
  }
);

// --- Mock/Demo Transactions ---
const generateMockTransactions = (count = 10) => {
  const statuses = ['success', 'pending', 'failed'];
  const gateways = ['Razorpay', 'Stripe', 'Cashfree'];
  const now = Date.now();
  return Array.from({ length: count }).map((_, idx) => ({
    _id: `txn_${idx + 1}`,
    collect_id: `COLLECT_${1000 + idx}`,
    school_id: `SCHOOL_${100 + idx}`,
    gateway: gateways[idx % gateways.length],
    order_amount: 1000 + (idx % 5) * 250,
    transaction_amount: 1000 + (idx % 5) * 250,
    status: statuses[idx % statuses.length],
    custom_order_id: `ORD-${202400 + idx}`,
    payment_time: idx % 3 !== 1 ? new Date(now - idx * 86400000).toISOString() : null,
  }));
};

const buildPaginatedResponse = (items, page = 1, limit = 10) => {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * limit;
  return {
    data: {
      data: items.slice(start, start + limit),
      total,
      page: safePage,
      limit,
      pages,
    },
  };
};

const cleanParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    if (Array.isArray(value)) {
      const arr = value.filter((v) => v != null && String(v).trim() !== '');
      if (arr.length) cleaned[key] = arr;
      return;
    }
    cleaned[key] = value;
  });
  return cleaned;
};

const toSearchParams = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
    else sp.append(key, value);
  });
  return sp;
};

// --- Public APIs ---
export const transactionAPI = IS_DEMO
  ? {
      getAll: async (params) => {
        const { page = 1, limit = 10, status, search } = cleanParams(params);
        let items = generateMockTransactions(25);
        if (status) items = items.filter((t) => t.status === status);
        if (search) {
          const s = String(search).toLowerCase();
          items = items.filter(
            (t) =>
              t.custom_order_id.toLowerCase().includes(s) ||
              t.collect_id.toLowerCase().includes(s) ||
              t.school_id.toLowerCase().includes(s)
          );
        }
        return Promise.resolve(buildPaginatedResponse(items, page, limit));
      },
      getBySchool: async (schoolId, params = {}) => {
        let items = generateMockTransactions(20).map((t) => ({ ...t, school_id: schoolId || t.school_id }));
        const { page = 1, limit = 10, status, search } = cleanParams(params);
        if (status) items = items.filter((t) => t.status === status);
        if (search) {
          const s = String(search).toLowerCase();
          items = items.filter(
            (t) =>
              t.custom_order_id.toLowerCase().includes(s) ||
              t.collect_id.toLowerCase().includes(s)
          );
        }
        return Promise.resolve(buildPaginatedResponse(items, page, limit));
      },
      getStatus: async (orderId) => {
        const match = generateMockTransactions(30).find((t) => t.custom_order_id === orderId);
        return Promise.resolve({ data: { data: match || null } });
      },
    }
  : {
      getAll: (params) => api.get('/transactions', { params: toSearchParams(cleanParams(params)) }),
      getBySchool: (schoolId, params) => api.get(`/transactions/school/${schoolId}`, { params: toSearchParams(cleanParams(params)) }),
      getStatus: (orderId) => api.get(`/transactions/transaction-status/${orderId}`),
    };

export const paymentAPI = IS_DEMO
  ? { create: async (data) => Promise.resolve({ data: { success: true, data } }) }
  : {
      create: (data) => api.post('/payment/create-payment', data),
    };

// --- Auth API ---
export const authAPI = IS_DEMO ? demoAuthAPI : {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  verifyToken: (token) => api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;
