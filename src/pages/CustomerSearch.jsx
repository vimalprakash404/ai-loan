import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useBatch } from '../hooks/useBatch';
import StepIndicator from '../components/ui/StepIndicator';
import ProcessingButton from '../components/ui/ProcessingButton';
import { Download, Search, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import customerDataImport from '../../customer.json';

// CSV export helper
function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

const CustomerSearch = () => {
  const { currentStep, isProcessing, processStep } = useAppContext();
  const { selectedBatch, batchId } = useBatch();

  if (!selectedBatch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Batch not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Step Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StepIndicator
          stepNumber={1}
          title="Fraud Detection"
          isActive={false}
          isCompleted={selectedBatch.results.fraudDetection !== null}
          isDisabled={false}
          batchId={selectedBatch.id}
          stepPath="fraud-detection"
        />
        <StepIndicator
          stepNumber={2}
          title="Market Intelligence"
          isActive={false}
          isCompleted={selectedBatch.results.marketIntel !== null}
          isDisabled={selectedBatch.results.fraudDetection === null}
          batchId={selectedBatch.id}
          stepPath="market-intelligence"
        />
        <StepIndicator
          stepNumber={3}
          title="Customer Search"
          isActive={currentStep === 3}
          isCompleted={selectedBatch.results.customerSearch !== null}
          isDisabled={selectedBatch.results.marketIntel === null}
          batchId={selectedBatch.id}
          stepPath="customer-search"
        />
      </div>

      {/* Batch Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Step 3: Customer Search</h2>
            <p className="text-gray-600">Batch: {selectedBatch.name} ({selectedBatch.id})</p>
          </div>
          
          <div className="flex items-center gap-3">
            <ProcessingButton
              currentStep={currentStep}
              selectedBatch={selectedBatch}
              isProcessing={isProcessing}
              onProcessStep={() => processStep(batchId)}
              onNextStep={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {selectedBatch.results.customerSearch && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Records Processed</p>
              <p className="text-2xl font-bold text-gray-900">{selectedBatch.results.customerSearch.processed.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Similarity Matches</p>
              <p className="text-2xl font-bold text-purple-600">{selectedBatch.results.customerSearch.similarityMatches}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Avg Similarity</p>
              <p className="text-2xl font-bold text-blue-600">{selectedBatch.results.customerSearch.avgSimilarity}</p>
            </div>
          </div>

          {/* Customer Details Table */}
          <CustomerDetailsTable />

          {/* Similarity Analysis Section */}
          {selectedBatch.results.customerSearch && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Similarity Analysis Results</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">High Similarity (90%+)</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {customerDataImport?.filter(c => c.similarity_score >= 0.9).length || 12}
                  </p>
                  <p className="text-sm text-purple-700">Critical matches found</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Medium Similarity (70-90%)</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {customerDataImport?.filter(c => c.similarity_score >= 0.7 && c.similarity_score < 0.9).length || 28}
                  </p>
                  <p className="text-sm text-orange-700">Requires review</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">Low Similarity (50-70%)</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {customerDataImport?.filter(c => c.similarity_score >= 0.5 && c.similarity_score < 0.7).length || 45}
                  </p>
                  <p className="text-sm text-yellow-700">Monitor closely</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Low Risk (&lt;50%)</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {customerDataImport?.filter(c => c.similarity_score < 0.5).length || 156}
                  </p>
                  <p className="text-sm text-green-700">Safe to proceed</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CustomerDetailsTable = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState('customer_id');
  const [sortDirection, setSortDirection] = React.useState('asc');
  const itemsPerPage = 10;

  // Load customer data from customer.json
  const customerData = customerDataImport || [];

  // Filter data based on search term
  const filteredData = customerData.filter(customer =>
    Object.values(customer).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aStr = aValue?.toString().toLowerCase() || '';
    const bStr = bValue?.toString().toLowerCase() || '';
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get all unique columns from the data
  const allColumns = customerData.length > 0 ? Object.keys(customerData[0]) : [];

  const formatCellValue = (value, key) => {
    if (value === null || value === undefined) return '-';
    
    if (key === 'is_fraud' || key === 'fraud_prediction') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1 || value === true ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {value === 1 || value === true ? 'FRAUD' : 'CLEAN'}
        </span>
      );
    }
    
    if (key.includes('score') || key.includes('ratio') || key.includes('rate')) {
      if (typeof value === 'number' && value < 1 && value > 0) {
        return (value * 100).toFixed(1) + '%';
      }
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return value.toString();
  };

  const getColumnDisplayName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Customer Similarity Analysis</h3>
              <p className="text-sm text-gray-600">{customerData.length} customers • {filteredData.length} filtered</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => exportToCSV(filteredData, 'customer-search-results.csv')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{customerData.length}</p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {customerData.filter(c => c.is_fraud === 1 || c.fraud_prediction === true).length}
            </p>
            <p className="text-sm text-gray-600">Fraud Cases</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {customerData.filter(c => c.is_fraud === 0 || c.fraud_prediction === false).length}
            </p>
            <p className="text-sm text-gray-600">Clean Records</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {customerData.length > 0 ? 
                ((customerData.filter(c => c.is_fraud === 1 || c.fraud_prediction === true).length / customerData.length) * 100).toFixed(1) + '%'
                : '0%'
              }
            </p>
            <p className="text-sm text-gray-600">Fraud Rate</p>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {allColumns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors min-w-32"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {getColumnDisplayName(column)}
                    {sortField === column && (
                      <span className="text-purple-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((customer, index) => (
              <tr key={customer.customer_id || index} className="hover:bg-gray-50 transition-colors">
                {allColumns.map((column) => (
                  <td key={column} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(customer[column], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 lg:px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerDetailsTable = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState('customer_id');
  const [sortDirection, setSortDirection] = React.useState('asc');
  const itemsPerPage = 10;

  // Load customer data from customer.json
  const customerData = customerDataImport || [];

  // Filter data based on search term
  const filteredData = customerData.filter(customer =>
    Object.values(customer).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aStr = aValue?.toString().toLowerCase() || '';
    const bStr = bValue?.toString().toLowerCase() || '';
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get all unique columns from the data
  const allColumns = customerData.length > 0 ? Object.keys(customerData[0]) : [];

  const formatCellValue = (value, key) => {
    if (value === null || value === undefined) return '-';
    
    if (key === 'is_fraud' || key === 'fraud_prediction') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1 || value === true ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {value === 1 || value === true ? 'FRAUD' : 'CLEAN'}
        </span>
      );
    }
    
    if (key.includes('score') || key.includes('ratio') || key.includes('rate')) {
      if (typeof value === 'number' && value < 1 && value > 0) {
        return (value * 100).toFixed(1) + '%';
      }
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return value.toString();
  };

  const getColumnDisplayName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Customer Details</h3>
              <p className="text-sm text-gray-600">{customerData.length} customers • {filteredData.length} filtered</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => exportToCSV(filteredData, 'customer-details.csv')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {allColumns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors min-w-32"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {getColumnDisplayName(column)}
                    {sortField === column && (
                      <span className="text-purple-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((customer, index) => (
              <tr key={customer.customer_id || index} className="hover:bg-gray-50 transition-colors">
                {allColumns.map((column) => (
                  <td key={column} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(customer[column], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 lg:px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;