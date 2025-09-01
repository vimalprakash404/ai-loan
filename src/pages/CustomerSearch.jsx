import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useBatch } from '../hooks/useBatch';
import StepIndicator from '../components/ui/StepIndicator';
import ProcessingButton from '../components/ui/ProcessingButton';
import { Download, Search, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import customerDataImport from '../../customer.json';

// CSV export helper for generic columns
function exportToCSV(data, columns, filename) {
  if (!data || data.length === 0) return;
  const header = columns.map(col => `"${col.header}"`).join(',');
  const rows = data.map(row =>
    columns.map(col => {
      let val = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
      if (typeof val === 'string') val = val.replace(/"/g, '""');
      return `"${val ?? ''}"`;
    }).join(',')
  );
  const csvContent = [header, ...rows].join('\r\n');
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

  // Extract all data from customer.json
  const customerData = customerDataImport?.customerData || {};
  const highRiskCustomers = customerData.high_risk_customers || [];
  const similarityAnalysis = customerData.similarity_analysis || [];

  // CSV columns for high risk and similarity tables
  const highRiskColumns = [
    { header: 'Customer ID', accessor: 'customer_id' },
    { header: 'Risk Score', accessor: row => (row.risk_score * 100).toFixed(1) + '%' },
    { header: 'Avg Similarity Top 10', accessor: row => (row.avg_similarity_top10 * 100).toFixed(1) + '%' },
    { header: 'Max Similarity', accessor: row => (row.max_similarity * 100).toFixed(1) + '%' },
    { header: 'Most Similar Customer ID', accessor: 'most_similar_customer_id' },
    { header: 'Fraud Count in Top 10', accessor: 'fraud_count_in_top10' },
    { header: 'Fraud Similarity Avg', accessor: row => (row.fraud_similarity_avg * 100).toFixed(2) + '%' },
  ];
  const similarityColumns = [
    { header: 'Customer ID', accessor: 'customer_id' },
    { header: 'Risk Score', accessor: row => (row.risk_score * 100).toFixed(1) + '%' },
    { header: 'Avg Similarity Top 10', accessor: row => (row.avg_similarity_top10 * 100).toFixed(1) + '%' },
    { header: 'Max Similarity', accessor: row => (row.max_similarity * 100).toFixed(1) + '%' },
    { header: 'Most Similar Customer ID', accessor: 'most_similar_customer_id' },
    { header: 'Fraud Count in Top 10', accessor: 'fraud_count_in_top10' },
    { header: 'Fraud Similarity Avg', accessor: row => (row.fraud_similarity_avg * 100).toFixed(2) + '%' },
  ];

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
      <div className="space-y-6">
        {/* High Risk Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">High Risk Customers</h3>
            <button
              className="ml-auto px-3 py-1.5 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
              onClick={() => exportToCSV(highRiskCustomers, highRiskColumns, 'high-risk-customers.csv')}
              type="button"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {highRiskColumns.map(col => (
                    <th key={col.header} className="text-left py-3 px-4 font-semibold text-gray-700">{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRiskCustomers.map((row, idx) => (
                  <tr key={row.customer_id} className="border-b border-gray-100 hover:bg-gray-50">
                    {highRiskColumns.map((col, cidx) => (
                      <td key={col.header} className="py-3 px-4 text-gray-900">
                        {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Similarity Analysis Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Similarity Analysis</h3>
            <button
              className="ml-auto px-3 py-1.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
              onClick={() => exportToCSV(similarityAnalysis, similarityColumns, 'similarity-analysis.csv')}
              type="button"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {similarityColumns.map(col => (
                    <th key={col.header} className="text-left py-3 px-4 font-semibold text-gray-700">{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {similarityAnalysis.map((row, idx) => (
                  <tr key={row.customer_id} className="border-b border-gray-100 hover:bg-gray-50">
                    {similarityColumns.map((col, cidx) => (
                      <td key={col.header} className="py-3 px-4 text-gray-900">
                        {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSearch;