import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useBatch } from '../hooks/useBatch';
import StepIndicator from '../components/ui/StepIndicator';
import ProcessingButton from '../components/ui/ProcessingButton';
import { MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import marketDataImport from '../../marget.json';

// CSV export helper
function exportToCSV(data, columns, filename) {
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

const MarketIntelligence = () => {
  const navigate = useNavigate();
  const { currentStep, isProcessing, processStep } = useAppContext();
  const { selectedBatch, batchId } = useBatch();

  if (!selectedBatch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Batch not found</p>
      </div>
    );
  }

  const handleNextStep = (nextPath) => {
    navigate(`/batch/${selectedBatch.id}/${nextPath}`);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Batch Header */}
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
          isActive={currentStep === 2}
          isCompleted={selectedBatch.results.marketIntel !== null}
          isDisabled={selectedBatch.results.fraudDetection === null}
          batchId={selectedBatch.id}
          stepPath="market-intelligence"
        />
        <StepIndicator
          stepNumber={3}
          title="Customer Search"
          isActive={false}
          isCompleted={selectedBatch.results.customerSearch !== null}
          isDisabled={selectedBatch.results.marketIntel === null}
          batchId={selectedBatch.id}
          stepPath="customer-search"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Step 2: Market Intelligence</h2>
            <p className="text-gray-600">Batch: {selectedBatch.name} ({selectedBatch.id})</p>
          </div>
          
          <div className="flex items-center gap-3">
            <ProcessingButton
              currentStep={currentStep}
              selectedBatch={selectedBatch}
              isProcessing={isProcessing}
              onProcessStep={() => processStep(batchId)}
              onNextStep={handleNextStep}
            />
          </div>
        </div>
      </div>

      {/* Step Progress */}
      

      {/* Results */}
      {selectedBatch.results.marketIntel && (
        <div className="space-y-6">
          {/* Market Intelligence Analysis */}
          <MarketIntelligenceAnalysis />
        </div>
      )}
    </div>
  );
};

const MarketIntelligenceAnalysis = () => {
  // Use the imported market data from marget.json
  const m = marketDataImport?.marketingData;
  if (!m) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Market Data Found</h3>
          <p className="text-gray-600">Could not load analytics from marget.json.</p>
        </div>
      </div>
    );
  }

  // Executive summary
  const exec = m.executive_summary;
  // City analysis
  const cities = m.geographic_analysis?.city_analysis || [];
  // Pincode analysis
  const pincodes = m.geographic_analysis?.pincode_analysis || [];
  // Recommendations
  const recommendations = m.recommendations || [];
  // Alerts
  const alerts = m.warnings_alerts || [];
  // General trends
  const trends = m.perplexity_intelligence?.general_trends?.analysis || "";

  // CSV column definitions
  const cityColumns = [
    { header: 'City', accessor: 'City' },
    { header: 'Fraud Rate', accessor: row => (row.fraud_rate * 100).toFixed(1) + '%' },
    { header: 'Fraud Cases', accessor: 'fraud_cases' },
    { header: 'Risk Level', accessor: 'risk_level' },
    { header: 'Customers', accessor: 'total_customers' },
    { header: 'Pincodes', accessor: 'unique_pincodes' },
  ];
  const pincodeColumns = [
    { header: 'Pincode', accessor: 'Pincode' },
    { header: 'Area', accessor: 'area_name' },
    { header: 'City', accessor: 'city' },
    { header: 'Fraud Rate', accessor: row => (row.fraud_rate * 100).toFixed(1) + '%' },
    { header: 'Risk Level', accessor: 'risk_level' },
    { header: 'Customers', accessor: 'total_customers' },
  ];
  const alertsColumns = [
    { header: 'Location', accessor: row => row.location || row.area_name },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Type', accessor: row => row.type?.replace(/_/g, ' ') },
    { header: 'Fraud Cases', accessor: 'fraud_cases' },
    { header: 'Fraud Rate', accessor: row => row.fraud_rate ? (row.fraud_rate * 100).toFixed(1) + '%' : '' },
    { header: 'Actions', accessor: row => (row.immediate_actions || row.recommended_actions || []).join('; ') },
  ];
  const recommendationsColumns = [
    { header: 'Action', accessor: 'action' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Affected Locations', accessor: 'affected_locations' },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">High Risk Pincodes</p>
          <p className="text-2xl font-bold text-red-600">{exec.total_customers}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600"> Hotspots</p>
          <p className="text-2xl font-bold text-red-600">{exec.total_fraud_cases}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">New Risk Areas</p>
          <p className="text-2xl font-bold text-orange-600">43</p>
        </div>
      </div>

       {/* Pincode Risk Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-bold text-gray-900">High-Risk Pincodes</h3>
          <button
            className="ml-auto px-3 py-1.5 rounded bg-orange-100 text-orange-700 text-xs font-semibold hover:bg-orange-200"
            onClick={() => exportToCSV(pincodes, pincodeColumns, 'pincode-risk-analysis.csv')}
            type="button"
          >
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pincode</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Area</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fraud Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customers</th>
              </tr>
            </thead>
            <tbody>
              {pincodes.map((p, idx) => (
                <tr key={p.Pincode} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{p.Pincode}</td>
                  <td className="py-3 px-4 text-gray-700">{p.area_name}</td>
                  <td className="py-3 px-4 text-gray-700">{p.city}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      p.risk_level === 'CRITICAL' ? 'text-red-600' :
                      p.risk_level === 'HIGH' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {(p.fraud_rate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      p.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {p.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{p.total_customers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* City Risk Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">City Risk Analysis</h3>
          <button
            className="ml-auto px-3 py-1.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
            onClick={() => exportToCSV(cities, cityColumns, 'city-risk-analysis.csv')}
            type="button"
          >
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fraud Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fraud Cases</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customers</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pincodes</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, idx) => (
                <tr key={city.City} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{city.City}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      city.risk_level === 'CRITICAL' ? 'text-red-600' :
                      city.risk_level === 'HIGH' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {(city.fraud_rate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{city.fraud_cases}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      city.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      city.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {city.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{city.total_customers}</td>
                  <td className="py-3 px-4 text-gray-700">{city.unique_pincodes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     

      {/* Alerts & Warnings */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <h3 className="text-lg font-bold text-red-900">Alerts & Warnings</h3>
            <button
              className="ml-auto px-3 py-1.5 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
              onClick={() => exportToCSV(alerts, alertsColumns, 'alerts-warnings.csv')}
              type="button"
            >
              Export CSV
            </button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{alert.location || alert.area_name}</span>
                  <span className="text-red-600 font-bold">{alert.priority}</span>
                </div>
                <p className="text-sm text-gray-700">{alert.type?.replace(/_/g, ' ')}</p>
                {alert.immediate_actions && (
                  <ul className="list-disc ml-5 text-sm text-red-700">
                    {alert.immediate_actions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
                {alert.recommended_actions && (
                  <ul className="list-disc ml-5 text-sm text-red-700">
                    {alert.recommended_actions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
          <h3 className="text-lg font-bold text-blue-900">AI-Powered Recommendations</h3>
          <button
            className="ml-auto px-3 py-1.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
            onClick={() => exportToCSV(recommendations, recommendationsColumns, 'recommendations.csv')}
            type="button"
          >
            Export CSV
          </button>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-1">{rec.action}</h4>
              <p className="text-sm text-gray-700">
                Priority: <span className="font-bold">{rec.priority}</span>
                {rec.affected_locations !== "All" && (
                  <> &middot; Affected: {rec.affected_locations}</>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* General Trends */}
      {trends && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">General Trends</h3>
          <pre className="text-gray-700 whitespace-pre-wrap">{trends}</pre>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;