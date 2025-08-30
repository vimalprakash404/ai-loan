import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const RiskFactorAnalysis = ({ marketData }) => {
  if (!marketData || marketData.length === 0) {
    return null;
  }

  // Analyze verification results
  const verificationAnalysis = {
    address: marketData.reduce((acc, record) => {
      acc[record.address_verification_result] = (acc[record.address_verification_result] || 0) + 1;
      return acc;
    }, {}),
    income: marketData.reduce((acc, record) => {
      acc[record.income_verification_result] = (acc[record.income_verification_result] || 0) + 1;
      return acc;
    }, {}),
    employment: marketData.reduce((acc, record) => {
      acc[record.employment_verification_result] = (acc[record.employment_verification_result] || 0) + 1;
      return acc;
    }, {})
  };

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
    count: marketData.filter(record => 
      record.credit_score >= range.min && record.credit_score <= range.max
    ).length,
    fraudCount: marketData.filter(record => 
      record.credit_score >= range.min && record.credit_score <= range.max && record.is_fraud === 1
    ).length
  }));

  // Document quality vs fraud correlation
  const documentQualityRanges = [
    { range: '0.0-0.2', min: 0.0, max: 0.2 },
    { range: '0.2-0.4', min: 0.2, max: 0.4 },
    { range: '0.4-0.6', min: 0.4, max: 0.6 },
    { range: '0.6-0.8', min: 0.6, max: 0.8 },
    { range: '0.8-1.0', min: 0.8, max: 1.0 }
  ];

  const documentQualityAnalysis = documentQualityRanges.map(range => ({
    range: range.range,
    total: marketData.filter(record => 
      record.document_quality_score >= range.min && record.document_quality_score < range.max
    ).length,
    fraud: marketData.filter(record => 
      record.document_quality_score >= range.min && record.document_quality_score < range.max && record.is_fraud === 1
    ).length
  })).map(item => ({
    ...item,
    fraudRate: item.total > 0 ? ((item.fraud / item.total) * 100).toFixed(1) : '0.0'
  }));

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Credit Score Distribution */}
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
    </div>
  );
};

export default RiskFactorAnalysis;