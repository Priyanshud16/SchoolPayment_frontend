import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, Download, Filter } from 'lucide-react';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';
import Filters from '../components/Filters';
import { useSchoolTransactions } from '../hooks/useTransactions';
import { SCHOOLS } from '../utils/constants';

const SchoolTransactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSchool, setSelectedSchool] = useState('');
  
  const schoolId = searchParams.get('schoolId') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';

  const {
    transactions,
    loading,
    error,
    pagination,
    updateFilters,
    changePage
  } = useSchoolTransactions(schoolId, {
    status,
    search,
    dateFrom,
    dateTo
  });

  useEffect(() => {
    // Set initial school from URL params if available
    if (schoolId && !selectedSchool) {
      setSelectedSchool(schoolId);
    }
  }, [schoolId, selectedSchool]);

  const handleFilter = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    if (schoolId) params.set('schoolId', schoolId);
    setSearchParams(params);
    updateFilters({});
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    changePage(newPage);
  };

  const handleSchoolChange = (e) => {
    const newSchoolId = e.target.value;
    setSelectedSchool(newSchoolId);
    
    const params = new URLSearchParams();
    if (newSchoolId) {
      params.set('schoolId', newSchoolId);
      params.set('page', '1');
    }
    
    // Preserve existing filters
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    
    setSearchParams(params);
  };

  const handleExport = () => {
    // In a real application, this would trigger a download
    console.log('Exporting data for school:', selectedSchool);
    // You would typically call an API endpoint here to generate and download a report
  };

  const selectedSchoolData = SCHOOLS.find(school => school.id === selectedSchool);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedSchoolData ? `Viewing transactions for ${selectedSchoolData.name}` : 'Select a school to view transactions'}
          </p>
        </div>
        
        {selectedSchool && (
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2 self-start"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        )}
      </div>

      {/* School Selection */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select School
        </label>
        <select
          value={selectedSchool}
          onChange={handleSchoolChange}
          className="input-field max-w-md"
        >
          <option value="">Select a school</option>
          {SCHOOLS.map(school => (
            <option key={school.id} value={school.id}>
              {school.name} ({school.code})
            </option>
          ))}
        </select>
      </div>

      {selectedSchool && (
        <>
          <Filters
            onFilter={handleFilter}
            onClear={handleClearFilters}
            loading={loading}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {selectedSchoolData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                    {selectedSchoolData.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    School Code: {selectedSchoolData.code}
                  </p>
                </div>
              </div>
            </div>
          )}

          <TransactionTable
            transactions={transactions}
            loading={loading}
            onSort={(field, order) => {
              const params = new URLSearchParams(searchParams);
              params.set('sort', field);
              params.set('order', order);
              setSearchParams(params);
            }}
            onFilter={handleFilter}
            onExport={handleExport}
          />

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            className="mt-6"
          />
        </>
      )}

      {!selectedSchool && (
        <div className="card text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Select a school
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a school from the dropdown above to view its transactions
          </p>
        </div>
      )}
    </div>
  );
};

export default SchoolTransactions;