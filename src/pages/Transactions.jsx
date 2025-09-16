import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';
import { transactionAPI } from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const lastRequestKeyRef = useRef('');
  
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const sort = searchParams.get('sort') || 'payment_time';
  const order = searchParams.get('order') || 'desc';
  const status = searchParams.getAll('status');
  const search = searchParams.get('search') || '';
  const schoolIds = searchParams.getAll('schoolId');

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, sort, order, status, search]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = { page, limit, sort, order };
      if (status && status.length > 0) params.status = status;
      if (schoolIds && schoolIds.length > 0) params.schoolId = schoolIds;
      if (search) params.search = search;

      const reqKey = JSON.stringify(params);
      if (reqKey === lastRequestKeyRef.current) {
        return; // avoid duplicate fetch with identical params (e.g., StrictMode)
      }
      lastRequestKeyRef.current = reqKey;

      const response = await transactionAPI.getAll(params);
      const data = response.data?.data || response.data || [];
      setTransactions(data);
      setTotalPages(response.data?.pages || 1);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field, order) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', field);
    params.set('order', order);
    setSearchParams(params);
  };

  const handleFilter = (filters) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    params.delete('status');
    if (filters.status && filters.status.length) {
      filters.status.forEach((s) => params.append('status', s));
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    } else {
      params.delete('search');
    }

    params.delete('schoolId');
    if (filters.schoolIds && filters.schoolIds.length) {
      filters.schoolIds.forEach((id) => params.append('schoolId', id));
    }
    
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
      </div>

      <TransactionTable
        transactions={transactions}
        loading={loading}
        onSort={handleSort}
        onFilter={handleFilter}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Transactions;