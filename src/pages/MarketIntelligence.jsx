import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useBatch } from '../hooks/useBatch';
import StepIndicator from '../components/ui/StepIndicator';
import ProcessingButton from '../components/ui/ProcessingButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, TrendingUp, AlertTriangle, Users, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import marketDataImport from '../../marget.json';

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

      {/* Results */}
      {selectedBatch.results.marketIntel && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Records Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">{selectedBatch.results.marketIntel.analyzed.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">High Risk Areas</p>
              <p className="text-2xl font-bold text-orange-600">{selectedBatch.results.marketIntel.highRiskAreas}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Avg Risk Score</p>
              <p className="text-2xl font-bold text-purple-600">{selectedBatch.results.marketIntel.avgRiskScore}%</p>
            </div>
          </div>

          {/* Market Intelligence Analysis */}
          <MarketIntelligenceAnalysis />
        </div>
      )}
    </div>
  );
};

const MarketIntelligenceAnalysis = ({ marketData }) => {
  // Use the imported market data from marget.json
  let dataArray = [];
  
  try {
    // Handle different possible structures of the JSON file
    if (Array.isArray(marketDataImport)) {
      dataArray = marketDataImport;
    } else if (marketDataImport && typeof marketDataImport === 'object') {
      // Try common property names for data arrays
      dataArray = marketDataImport.data || 
                  marketDataImport.customers || 
                  marketDataImport.records || 
                  Object.values(marketDataImport)[0] || 
                  [];
    }
    
    // Ensure we have an array
    if (!Array.isArray(dataArray)) {
      dataArray = [];
    }
  } catch (error) {
    console.error('Error processing market data:', error);
    dataArray = [];
  }

  console.log('Market data loaded:', dataArray.length, 'records');

  if (dataArray.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Market Data...</h3>
          <p className="text-gray-600">Please ensure marget.json contains valid customer data.</p>
          <div className="mt-4 text-xs text-gray-500">
            Expected format: Array of customer objects or object with data property
          </div>
        </div>
      </div>
    );
  }

  // Calculate insights from the data
  const totalRecords = dataArray.length;
  const fraudulentRecords = dataArray.filter(record => record.is_fraud === 1).length;
  const fraudRate = ((fraudulentRecords / totalRecords) * 100).toFixed(1);
  
  // Group by city and calculate risk scores
  const cityStats = dataArray.reduce((acc, record) => {
    const city = record.city;
    if (!acc[city]) {
      acc[city] = {
        city,
        totalRecords: 0,
        fraudRecords: 0,
        avgCreditScore: 0,
        avgIncomeAlignment: 0,
        avgDigitalFootprint: 0,
        pincodes: new Set()
      };
    }
    
    acc[city].totalRecords++;
    acc[city].fraudRecords += record.is_fraud;
    acc[city].avgCreditScore += record.credit_score;
    acc[city].avgIncomeAlignment += record.income_profession_alignment;
    acc[city].avgDigitalFootprint += record.digital_footprint_consistency;
    acc[city].pincodes.add(record.pincode);
    
    return acc;
  }, {});

  // Calculate averages and fraud rates
  const cityAnalysis = Object.values(cityStats).map(city => ({
    ...city,
    fraudRate: ((city.fraudRecords / city.totalRecords) * 100).toFixed(1),
    avgCreditScore: Math.round(city.avgCreditScore / city.totalRecords),
    avgIncomeAlignment: (city.avgIncomeAlignment / city.totalRecords).toFixed(3),
    avgDigitalFootprint: (city.avgDigitalFootprint / city.totalRecords).toFixed(3),
    uniquePincodes: city.pincodes.size,
    riskLevel: city.fraudRecords / city.totalRecords > 0.15 ? 'HIGH' : 
               city.fraudRecords / city.totalRecords > 0.08 ? 'MEDIUM' : 'LOW'
  })).sort((a, b) => parseFloat(b.fraudRate) - parseFloat(a.fraudRate));

  // High-risk areas (fraud rate > 15%)
  const highRiskAreas = cityAnalysis.filter(city => parseFloat(city.fraudRate) > 15);
  
  // Credit score distribution
  const creditScoreRanges = [
    { range: '300-500', min: 300, max: 500, color: '#ef4444' },
    { range: '501-600', min: 501, max: 600, color: '#f97316' },
    { range: '601-700', min: 601, max: 700, color: '#eab308' },
    { range: '701-800', min: 701, max: 800, color: '#22c55e' },
    { range: '801-850', min: 801, max: 850, color: '#10b981' }
  ];

  const creditDistribution = creditScoreRanges.map(range => ({
    ...range,
    count: dataArray.filter(record => 
      record.credit_score >= range.min && record.credit_score <= range.max
    ).length,
    fraudCount: dataArray.filter(record => 
      record.credit_score >= range.min && record.credit_score <= range.max && record.is_fraud === 1
    ).length
  }));

  // Document quality analysis
  const documentQualityRanges = [
    { range: '0.0-0.2', min: 0.0, max: 0.2 },
    { range: '0.2-0.4', min: 0.2, max: 0.4 },
    { range: '0.4-0.6', min: 0.4, max: 0.6 },
    { range: '0.6-0.8', min: 0.6, max: 0.8 },
    { range: '0.8-1.0', min: 0.8, max: 1.0 }
  ];

  const documentQualityAnalysis = documentQualityRanges.map(range => ({
    range: range.range,
    total: dataArray.filter(record => 
      record.document_quality_score >= range.min && record.document_quality_score < range.max
    ).length,
    fraud: dataArray.filter(record => 
      record.document_quality_score >= range.min && record.document_quality_score < range.max && record.is_fraud === 1
    ).length
  })).map(item => ({
    ...item,
    fraudRate: item.total > 0 ? ((item.fraud / item.total) * 100).toFixed(1) : '0.0'
  }));

  // Verification analysis
  const verificationAnalysis = {
    address: dataArray.reduce((acc, record) => {
      acc[record.address_verification_result] = (acc[record.address_verification_result] || 0) + 1;
      return acc;
    }, {}),
    income: dataArray.reduce((acc, record) => {
      acc[record.income_verification_result] = (acc[record.income_verification_result] || 0) + 1;
      return acc;
    }, {}),
    employment: dataArray.reduce((acc, record) => {
      acc[record.employment_verification_result] = (acc[record.employment_verification_result] || 0) + 1;
      return acc;
    }, {})
  };

  // Top risk factors
  const riskFactors = [
    {
      factor: 'Low Credit Score',
      count: dataArray.filter(r => r.credit_score < 600).length,
      percentage: ((dataArray.filter(r => r.credit_score < 600).length / totalRecords) * 100).toFixed(1)
    },
    {
      factor: 'High Debt-to-Income',
      count: dataArray.filter(r => r.debt_to_income_ratio > 0.6).length,
      percentage: ((dataArray.filter(r => r.debt_to_income_ratio > 0.6).length / totalRecords) * 100).toFixed(1)
    },
    {
      factor: 'Poor Document Quality',
      count: dataArray.filter(r => r.document_quality_score < 0.3).length,
      percentage: ((dataArray.filter(r => r.document_quality_score < 0.3).length / totalRecords) * 100).toFixed(1)
    },
    {
      factor: 'Failed Employment Verification',
      count: dataArray.filter(r => r.employment_verification_result === 'Failed' || r.employment_verification_result === 'Not Verified').length,
      percentage: ((dataArray.filter(r => r.employment_verification_result === 'Failed' || r.employment_verification_result === 'Not Verified').length / totalRecords) * 100).toFixed(1)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalRecords.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Fraud Rate</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{fraudRate}%</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">High Risk Areas</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{highRiskAreas.length}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Cities Analyzed</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{cityAnalysis.length}</p>
        </div>
      </div>

      {/* Geographic Risk Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Geographic Risk Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Records</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fraud Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Credit Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pincodes</th>
              </tr>
            </thead>
            <tbody>
              {cityAnalysis.map((city, index) => (
                <tr key={city.city} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{city.city}</td>
                  <td className="py-3 px-4 text-gray-700">{city.totalRecords}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      parseFloat(city.fraudRate) > 15 ? 'text-red-600' :
                      parseFloat(city.fraudRate) > 8 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {city.fraudRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{city.avgCreditScore}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      city.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                      city.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {city.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{city.uniquePincodes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Score Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Credit Score Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={creditDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                formatter={(value, name) => [value, name === 'count' ? 'Total Records' : 'Fraud Cases']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="count" />
              <Bar dataKey="fraudCount" fill="#ef4444" radius={[4, 4, 0, 0]} name="fraudCount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Document Quality vs Fraud Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Document Quality vs Fraud Rate</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={documentQualityAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                label={{ value: 'Document Quality Score', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                label={{ value: 'Fraud Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'fraudRate' ? `${value}%` : value,
                  name === 'fraudRate' ? 'Fraud Rate' : 'Total Records'
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="fraudRate" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Risk Factors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Key Risk Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskFactors.map((factor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                <span className="text-sm font-medium text-orange-600">{factor.percentage}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${factor.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{factor.count} records</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address Verification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-900 mb-4">Address Verification</h4>
          <div className="space-y-3">
            {Object.entries(verificationAnalysis.address).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === 'Verified' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Income Verification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-900 mb-4">Income Verification</h4>
          <div className="space-y-3">
            {Object.entries(verificationAnalysis.income).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === 'Verified' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employment Verification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-900 mb-4">Employment Verification</h4>
          <div className="space-y-3">
            {Object.entries(verificationAnalysis.employment).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === 'Verified' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Risk Areas Alert */}
      {highRiskAreas.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">High Risk Areas Detected</h3>
              <p className="text-red-700 mb-4">
                {highRiskAreas.length} cities show fraud rates above 15%. Immediate attention recommended.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {highRiskAreas.map((area, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{area.city}</span>
                      <span className="text-red-600 font-bold">{area.fraudRate}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{area.totalRecords} records • {area.uniquePincodes} pincodes</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-2">AI-Powered Recommendations</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-1">Enhanced Verification</h4>
                <p className="text-sm text-gray-700">
                  Implement additional document verification for applications from {highRiskAreas.length > 0 ? highRiskAreas[0].city : 'high-risk areas'} 
                  due to elevated fraud rates.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-1">Credit Score Threshold</h4>
                <p className="text-sm text-gray-700">
                  Consider raising minimum credit score requirements to 650+ for applications with poor digital footprint consistency.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-1">Employment Verification</h4>
                <p className="text-sm text-gray-700">
                  Strengthen employment verification processes as {riskFactors[3]?.percentage}% of records show verification failures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;