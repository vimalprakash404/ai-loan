import React from 'react';
import { MapPin, TrendingUp, AlertCircle } from 'lucide-react';

const GeographicHeatmap = ({ marketData }) => {
  if (!marketData || marketData.length === 0) {
    return null;
  }

  // Group by pincode and calculate risk metrics
  const pincodeStats = marketData.reduce((acc, record) => {
    const pincode = record.pincode;
    if (!acc[pincode]) {
      acc[pincode] = {
        pincode,
        city: record.city,
        totalRecords: 0,
        fraudRecords: 0,
        avgCreditScore: 0,
        avgDocumentQuality: 0,
        avgFinancialRisk: 0
      };
    }
    
    acc[pincode].totalRecords++;
    acc[pincode].fraudRecords += record.is_fraud;
    acc[pincode].avgCreditScore += record.credit_score;
    acc[pincode].avgDocumentQuality += record.document_quality_score;
    acc[pincode].avgFinancialRisk += record.financial_risk_score;
    
    return acc;
  }, {});

  // Calculate final metrics and sort by risk
  const pincodeAnalysis = Object.values(pincodeStats)
    .map(pincode => ({
      ...pincode,
      fraudRate: ((pincode.fraudRecords / pincode.totalRecords) * 100).toFixed(1),
      avgCreditScore: Math.round(pincode.avgCreditScore / pincode.totalRecords),
      avgDocumentQuality: (pincode.avgDocumentQuality / pincode.totalRecords).toFixed(3),
      avgFinancialRisk: (pincode.avgFinancialRisk / pincode.totalRecords).toFixed(3),
      riskScore: (
        (pincode.fraudRecords / pincode.totalRecords) * 0.4 +
        (1 - (pincode.avgCreditScore / pincode.totalRecords) / 850) * 0.3 +
        (pincode.avgFinancialRisk / pincode.totalRecords) * 0.3
      ).toFixed(3)
    }))
    .sort((a, b) => parseFloat(b.riskScore) - parseFloat(a.riskScore))
    .slice(0, 10); // Top 10 riskiest pincodes

  const getRiskColor = (riskScore) => {
    const score = parseFloat(riskScore);
    if (score > 0.6) return 'bg-red-500';
    if (score > 0.4) return 'bg-orange-500';
    if (score > 0.2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLevel = (riskScore) => {
    const score = parseFloat(riskScore);
    if (score > 0.6) return 'CRITICAL';
    if (score > 0.4) return 'HIGH';
    if (score > 0.2) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Geographic Risk Heatmap</h3>
      </div>

      <div className="space-y-4">
        {/* Risk Legend */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Risk Level:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low</span>
          </div>
        </div>

        {/* Pincode Risk Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pincode</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Records</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fraud Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Credit</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {pincodeAnalysis.map((pincode, index) => (
                <tr key={pincode.pincode} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{pincode.pincode}</td>
                  <td className="py-3 px-4 text-gray-700">{pincode.city}</td>
                  <td className="py-3 px-4 text-gray-700">{pincode.totalRecords}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      parseFloat(pincode.fraudRate) > 20 ? 'text-red-600' :
                      parseFloat(pincode.fraudRate) > 10 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {pincode.fraudRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{pincode.avgCreditScore}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(pincode.riskScore)}`}></div>
                      <span className="font-medium">{pincode.riskScore}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getRiskLevel(pincode.riskScore) === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      getRiskLevel(pincode.riskScore) === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      getRiskLevel(pincode.riskScore) === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {getRiskLevel(pincode.riskScore)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatmap;