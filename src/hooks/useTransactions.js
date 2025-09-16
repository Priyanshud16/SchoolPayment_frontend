import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

export const useTransactions = (initialParams = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState(initialParams);
  const [lastRequestKey, setLastRequestKey] = useState('');

  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...params
      };

      const reqKey = JSON.stringify(queryParams);
      if (reqKey === lastRequestKey) {
        return; // avoid duplicate fetch with identical params
      }
      setLastRequestKey(reqKey);

      const response = await transactionAPI.getAll(queryParams);
      const data = response.data?.data || response.data || [];
      setTransactions(data);
      setPagination({
        page: response.data?.page ?? pagination.page,
        limit: response.data?.limit ?? pagination.limit,
        total: response.data?.total ?? data.length,
        pages: response.data?.pages ?? 1
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const changeLimit = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.limit, filters]);

  return {
    transactions,
    loading,
    error,
    pagination,
    filters,
    fetchTransactions,
    updateFilters,
    changePage,
    changeLimit,
    refetch: fetchTransactions
  };
};

export const useSchoolTransactions = (schoolId, initialParams = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState(initialParams);

  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...params
      };

      const response = await transactionAPI.getBySchool(schoolId, queryParams);
      const data = response.data?.data || response.data || [];
      setTransactions(data);
      setPagination({
        page: response.data?.page ?? pagination.page,
        limit: response.data?.limit ?? pagination.limit,
        total: response.data?.total ?? data.length,
        pages: response.data?.pages ?? 1
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      console.error('Error fetching school transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const changeLimit = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  useEffect(() => {
    if (schoolId) {
      fetchTransactions();
    }
  }, [schoolId, pagination.page, pagination.limit, filters]);

  return {
    transactions,
    loading,
    error,
    pagination,
    filters,
    fetchTransactions,
    updateFilters,
    changePage,
    changeLimit,
    refetch: fetchTransactions
  };
};