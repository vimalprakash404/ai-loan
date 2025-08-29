import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ScatterChart, Scatter } from 'recharts';

// Color palettes for charts
const COLORS = {
  primary: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a'],
  risk: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'],
  gradient: ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981']
};

export const RiskDistributionChart = ({ data }) => {
  const pieData = [
    { name: 'Critical', value: 89, color: '#ef4444' },
    { name: 'High', value: 156, color: '#f97316' },
    { name: 'Medium', value: 234, color: '#eab308' },
    { name: 'Low', value: 768, color: '#22c55e' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [value, 'Cases']}
            labelStyle={{ color: '#374151' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FraudTrendChart = () => {
  const trendData = [
    { month: 'Jan', fraud: 45, total: 1200, rate: 3.75 },
    { month: 'Feb', fraud: 52, total: 1350, rate: 3.85 },
    { month: 'Mar', fraud: 38, total: 1100, rate: 3.45 },
    { month: 'Apr', fraud: 67, total: 1450, rate: 4.62 },
    { month: 'May', fraud: 71, total: 1380, rate: 5.14 },
    { month: 'Jun', fraud: 89, total: 1247, rate: 7.14 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="month" 
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
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="fraud"
            stroke="#ef4444"
            fill="url(#fraudGradient)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ModelPerformanceChart = () => {
  const performanceData = [
    { metric: 'Precision', value: 94.7, target: 90 },
    { metric: 'Recall', value: 89.3, target: 85 },
    { metric: 'F1-Score', value: 91.8, target: 88 },
    { metric: 'Accuracy', value: 94.7, target: 92 },
    { metric: 'Specificity', value: 96.2, target: 94 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={performanceData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            type="category" 
            dataKey="metric"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={80}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Score']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="target" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
          <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GeographicRiskChart = () => {
  const geoData = [
    { city: 'Mumbai', pincode: '400001', riskScore: 8.3, cases: 1247, fraudRate: 8.3 },
    { city: 'Delhi', pincode: '110001', riskScore: 7.8, cases: 892, fraudRate: 7.8 },
    { city: 'Bangalore', pincode: '560001', riskScore: 6.9, cases: 1034, fraudRate: 6.9 },
    { city: 'Chennai', pincode: '600001', riskScore: 6.2, cases: 756, fraudRate: 6.2 },
    { city: 'Kolkata', pincode: '700001', riskScore: 5.8, cases: 623, fraudRate: 5.8 },
    { city: 'Hyderabad', pincode: '500001', riskScore: 5.4, cases: 445, fraudRate: 5.4 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={geoData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="cases"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Total Cases', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
          />
          <YAxis 
            dataKey="fraudRate"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Fraud Rate (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'fraudRate' ? `${value}%` : value,
              name === 'fraudRate' ? 'Fraud Rate' : 'Cases'
            ]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.city || ''}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Scatter dataKey="fraudRate" fill="#ef4444" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SimilarityAnalysisChart = () => {
  const similarityData = [
    { customerId: 'CUST-67890', similarity: 94, riskScore: 87, status: 'Fraud' },
    { customerId: 'CUST-54321', similarity: 87, riskScore: 54, status: 'Review' },
    { customerId: 'CUST-98765', similarity: 82, riskScore: 73, status: 'Flagged' },
    { customerId: 'CUST-11111', similarity: 78, riskScore: 45, status: 'Clean' },
    { customerId: 'CUST-22222', similarity: 75, riskScore: 62, status: 'Review' },
    { customerId: 'CUST-33333', similarity: 71, riskScore: 38, status: 'Clean' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={similarityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="similarity"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Similarity Score', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
          />
          <YAxis 
            dataKey="riskScore"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${value}${name === 'similarity' ? '%' : ''}`,
              name === 'similarity' ? 'Similarity' : 'Risk Score'
            ]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.customerId || ''}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Scatter 
            dataKey="riskScore" 
            fill={(entry) => {
              const status = entry.status;
              return status === 'Fraud' ? '#ef4444' : 
                     status === 'Flagged' ? '#f97316' : 
                     status === 'Review' ? '#eab308' : '#22c55e';
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProcessingTimeChart = () => {
  const processingData = [
    { step: 'Data Ingestion', time: 0.3, cumulative: 0.3 },
    { step: 'Feature Engineering', time: 0.8, cumulative: 1.1 },
    { step: 'ML Prediction', time: 0.4, cumulative: 1.5 },
    { step: 'Risk Scoring', time: 0.2, cumulative: 1.7 },
    { step: 'Report Generation', time: 0.6, cumulative: 2.3 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processingData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="step"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
          />
          <Tooltip 
            formatter={(value) => [`${value}s`, 'Processing Time']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FeatureImportanceChart = () => {
  const featureData = [
    { feature: 'Document Quality', importance: 0.23, category: 'Identity' },
    { feature: 'Financial Risk', importance: 0.19, category: 'Financial' },
    { feature: 'Digital Footprint', importance: 0.16, category: 'Digital' },
    { feature: 'Income Verification', importance: 0.14, category: 'Financial' },
    { feature: 'Biometric Score', importance: 0.12, category: 'Identity' },
    { feature: 'Employment Check', importance: 0.09, category: 'Professional' },
    { feature: 'Address Verification', importance: 0.07, category: 'Identity' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={featureData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            type="number" 
            domain={[0, 0.25]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <YAxis 
            type="category" 
            dataKey="feature"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            width={100}
          />
          <Tooltip 
            formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar 
            dataKey="importance" 
            fill="#8b5cf6" 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RealTimeMonitoringChart = () => {
  const realtimeData = [
    { time: '09:00', transactions: 45, frauds: 2, rate: 4.4 },
    { time: '10:00', transactions: 67, frauds: 3, rate: 4.5 },
    { time: '11:00', transactions: 89, frauds: 7, rate: 7.9 },
    { time: '12:00', transactions: 123, frauds: 5, rate: 4.1 },
    { time: '13:00', transactions: 98, frauds: 8, rate: 8.2 },
    { time: '14:00', transactions: 76, frauds: 4, rate: 5.3 },
    { time: '15:00', transactions: 134, frauds: 12, rate: 9.0 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={realtimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="transactions" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="Transactions"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="rate" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            name="Fraud Rate (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GeographicHeatmapChart = () => {
  const heatmapData = [
    { region: 'North', risk: 6.8, cases: 2340 },
    { region: 'South', risk: 5.9, cases: 1890 },
    { region: 'East', risk: 7.2, cases: 1560 },
    { region: 'West', risk: 8.1, cases: 2780 },
    { region: 'Central', risk: 4.3, cases: 890 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={heatmapData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="region"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'risk' ? `${value}%` : value.toLocaleString(),
              name === 'risk' ? 'Risk Score' : 'Total Cases'
            ]}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar 
            dataKey="risk" 
            fill="#f97316"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CustomerSimilarityChart = () => {
  const similarityData = [
    { range: '90-100%', count: 12, avgRisk: 85 },
    { range: '80-90%', count: 28, avgRisk: 67 },
    { range: '70-80%', count: 45, avgRisk: 52 },
    { range: '60-70%', count: 67, avgRisk: 38 },
    { range: '50-60%', count: 89, avgRisk: 25 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={similarityData}>
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
            formatter={(value, name) => [
              name === 'avgRisk' ? `${value}%` : value,
              name === 'avgRisk' ? 'Avg Risk Score' : 'Customer Count'
            ]}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8b5cf6"
            fill="url(#similarityGradient)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="similarityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};