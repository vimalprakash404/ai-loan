import React from 'react';
import { MapPin, TrendingUp, AlertTriangle, Users, DollarSign, Shield } from 'lucide-react';

const MarketInsights = ({ marketData }) => {
  if (!marketData || marketData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No market data available
      </div>
    );
  }

  // Calculate insights from the data
  const totalRecords = marketData.length;
  const fraudulentRecords = marketData.filter(record => record.is_fraud === 1).length;
  const fraudRate = ((fraudulentRecords / totalRecords) * 100).toFixed(1);
  
  // Group by city and calculate risk scores
  const cityStats = marketData.reduce((acc, record) => {
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
  
  // Top risk factors analysis
  const riskFactors = [
    {
      factor: 'Low Credit Score',
      count: marketData.filter(r => r.credit_score < 600).length,
      percentage: ((marketData.filter(r => r.credit_score < 600).length / totalRecords) * 100).toFixed(1)
    },
    {
      factor: 'High Debt-to-Income',
      count: marketData.filter(r => r.debt_to_income_ratio > 0.6).length,
      percentage: ((marketData.filter(r => r.debt_to_income_ratio > 0.6).length / totalRecords) * 100).toFixed(1)
    },
    {
      factor: 'Poor Document Quality',
      count: marketData.filter(r => r.document_quality_score < 0.3).length,
      percentage: ((marketData.filter(r => r.document_quality_score < 0.3).length / totalRecords) * 100).toFixed(1)
    },
    {
      factor: 'Failed Employment Verification',
      count: marketData.filter(r => r.employment_verification_result === 'Failed' || r.employment_verification_result === 'Not Verified').length,
      percentage: ((marketData.filter(r => r.employment_verification_result === 'Failed' || r.employment_verification_result === 'Not Verified').length / totalRecords) * 100).toFixed(1)
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

      {/* City Risk Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Risk Analysis</h3>
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

      {/* Risk Factors Analysis */}
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

export default MarketInsights;