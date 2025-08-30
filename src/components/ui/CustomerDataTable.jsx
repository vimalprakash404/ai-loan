import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const CustomerDataTable = ({ data, onExportCSV }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('customer_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aStr = aValue.toString().toLowerCase();
    const bStr = bValue.toString().toLowerCase();
    
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

  const columns = [
    { key: 'customer_id', label: 'Customer ID', width: 'w-32' },
    { key: 'city', label: 'City', width: 'w-24' },
    { key: 'pincode', label: 'Pincode', width: 'w-20' },
    { key: 'document_quality_score', label: 'Doc Quality', width: 'w-20' },
    { key: 'document_consistency_score', label: 'Doc Consistency', width: 'w-24' },
    { key: 'biometric_verification_score', label: 'Biometric', width: 'w-20' },
    { key: 'address_verification_result', label: 'Address Verify', width: 'w-24' },
    { key: 'identity_match_score', label: 'Identity Match', width: 'w-24' },
    { key: 'document_metadata_consistency', label: 'Doc Metadata', width: 'w-24' },
    { key: 'income_verification_result', label: 'Income Verify', width: 'w-24' },
    { key: 'income_profession_alignment', label: 'Income Align', width: 'w-20' },
    { key: 'banking_history_months', label: 'Banking History', width: 'w-24' },
    { key: 'financial_distress_indicators', label: 'Financial Distress', width: 'w-24' },
    { key: 'credit_score', label: 'Credit Score', width: 'w-20' },
    { key: 'debt_to_income_ratio', label: 'Debt/Income', width: 'w-20' },
    { key: 'premium_to_income_ratio', label: 'Premium/Income', width: 'w-24' },
    { key: 'social_media_presence_score', label: 'Social Media', width: 'w-20' },
    { key: 'digital_footprint_consistency', label: 'Digital Footprint', width: 'w-24' },
    { key: 'employment_verification_result', label: 'Employment', width: 'w-24' },
    { key: 'professional_credential_validation', label: 'Credentials', width: 'w-20' },
    { key: 'digital_presence_age_months', label: 'Digital Age', width: 'w-20' },
    { key: 'digital_reputation_score', label: 'Digital Rep', width: 'w-20' },
    { key: 'identity_verification_composite', label: 'Identity Composite', width: 'w-24' },
    { key: 'financial_risk_score', label: 'Financial Risk', width: 'w-24' },
    { key: 'digital_consistency_score', label: 'Digital Consistency', width: 'w-24' },
    { key: 'identity_financial_mismatch', label: 'ID/Financial Mismatch', width: 'w-24' },
    { key: 'is_fraud', label: 'Fraud', width: 'w-16' }
  ];

  const formatCellValue = (value, key) => {
    if (key === 'is_fraud') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {value === 1 ? 'FRAUD' : 'CLEAN'}
        </span>
      );
    }
    
    if (typeof value === 'number' && value < 1 && value > 0) {
      return value.toFixed(3);
    }
    
    return value;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Customer Data Analysis</h3>
            <p className="text-sm text-gray-600">{data.length} records • {filteredData.length} filtered</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={onExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.width} px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortField === column.key && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr key={row.customer_id} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(row[column.key], column.key)}
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
                          ? 'bg-blue-600 text-white'
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

export default CustomerDataTable;