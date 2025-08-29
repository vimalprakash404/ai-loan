import React, { useState } from 'react';
import { Shield, Upload, BarChart3, Users, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, MapPin, Search, FileText, Download, Eye } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResults({
        totalRecords: 1247,
        fraudDetected: 89,
        highRisk: 156,
        mediumRisk: 234,
        lowRisk: 768,
        accuracy: 94.7,
        processingTime: '2.3s'
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <span className="text-xs text-gray-500 font-medium">{subtitle}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );

  const RiskCard = ({ level, count, percentage, color }) => (
    <div className="bg-white rounded-lg p-4 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{level} Risk</h4>
          <p className="text-2xl font-bold" style={{ color }}>{count}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">of total</p>
          <p className="text-lg font-semibold" style={{ color }}>{percentage}%</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FraudGuard</h1>
                <p className="text-xs text-gray-500 hidden sm:block">ML-Powered Detection System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                System Online
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">AD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto">
            <TabButton
              id="dashboard"
              label="Dashboard"
              icon={BarChart3}
              isActive={activeTab === 'dashboard'}
              onClick={setActiveTab}
            />
            <TabButton
              id="fraud-detection"
              label="Fraud Detection"
              icon={Shield}
              isActive={activeTab === 'fraud-detection'}
              onClick={setActiveTab}
            />
            <TabButton
              id="market-intelligence"
              label="Market Intel"
              icon={MapPin}
              isActive={activeTab === 'market-intelligence'}
              onClick={setActiveTab}
            />
            <TabButton
              id="customer-search"
              label="Customer Search"
              icon={Search}
              isActive={activeTab === 'customer-search'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard
                title="Total Processed"
                value="12,847"
                subtitle="This Month"
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Fraud Detected"
                value="289"
                subtitle="2.25% Rate"
                icon={AlertTriangle}
                color="red"
              />
              <StatCard
                title="Accuracy Rate"
                value="94.7%"
                subtitle="ML Model"
                icon={TrendingUp}
                color="green"
              />
              <StatCard
                title="Processing Time"
                value="1.2s"
                subtitle="Average"
                icon={Clock}
                color="purple"
              />
            </div>

            {/* Risk Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Risk Distribution</h2>
                <p className="text-sm text-gray-600 mt-1">Current month analysis breakdown</p>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <RiskCard level="Critical" count="89" percentage="7.1" color="#ef4444" />
                  <RiskCard level="High" count="156" percentage="12.5" color="#f97316" />
                  <RiskCard level="Medium" count="234" percentage="18.7" color="#eab308" />
                  <RiskCard level="Low" count="768" percentage="61.7" color="#22c55e" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { id: 'CUST-001', risk: 'HIGH', score: 0.87, time: '2 min ago', status: 'flagged' },
                  { id: 'CUST-002', risk: 'LOW', score: 0.23, time: '5 min ago', status: 'approved' },
                  { id: 'CUST-003', risk: 'MEDIUM', score: 0.54, time: '8 min ago', status: 'review' },
                  { id: 'CUST-004', risk: 'CRITICAL', score: 0.94, time: '12 min ago', status: 'blocked' },
                ].map((item) => (
                  <div key={item.id} className="p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'flagged' ? 'bg-red-500' :
                        item.status === 'approved' ? 'bg-green-500' :
                        item.status === 'review' ? 'bg-yellow-500' : 'bg-red-600'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{item.id}</p>
                        <p className="text-sm text-gray-500">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Risk Score: {item.score}</p>
                        <p className={`text-xs font-medium ${
                          item.risk === 'CRITICAL' ? 'text-red-600' :
                          item.risk === 'HIGH' ? 'text-orange-600' :
                          item.risk === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                        }`}>{item.risk}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fraud-detection' && (
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">ML-Based Fraud Detection</h2>
                <p className="text-sm text-gray-600 mt-1">Upload customer data for real-time fraud analysis</p>
              </div>
              <div className="p-4 lg:p-6">
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Customer Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload CSV files with customer information for batch analysis</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <Upload size={16} />
                      Choose CSV File
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                            <p className="text-sm text-blue-700">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={simulateAnalysis}
                          disabled={isAnalyzing}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <BarChart3 size={16} />
                              Start Analysis
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {analysisResults && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={20} />
                        <span className="font-semibold">Analysis Complete</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Total Records</p>
                          <p className="text-2xl font-bold text-gray-900">{analysisResults.totalRecords.toLocaleString()}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <p className="text-sm text-red-600">Fraud Detected</p>
                          <p className="text-2xl font-bold text-red-600">{analysisResults.fraudDetected}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm text-green-600">Model Accuracy</p>
                          <p className="text-2xl font-bold text-green-600">{analysisResults.accuracy}%</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-blue-600">Processing Time</p>
                          <p className="text-2xl font-bold text-blue-600">{analysisResults.processingTime}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Download size={16} />
                          Download Report
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye size={16} />
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Model Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Model Features</h3>
                <div className="space-y-3">
                  {[
                    'Document Quality Assessment',
                    'Financial Risk Scoring',
                    'Employment Verification',
                    'Biometric Verification',
                    'Digital Footprint Analysis',
                    'Identity Verification'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Categories</h3>
                <div className="space-y-3">
                  {[
                    { level: 'CRITICAL', range: '0.8 - 1.0', color: 'text-red-600' },
                    { level: 'HIGH', range: '0.6 - 0.8', color: 'text-orange-600' },
                    { level: 'MEDIUM', range: '0.4 - 0.6', color: 'text-yellow-600' },
                    { level: 'LOW', range: '0.2 - 0.4', color: 'text-blue-600' },
                    { level: 'MINIMAL', range: '0.0 - 0.2', color: 'text-green-600' }
                  ].map((risk, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className={`font-medium ${risk.color}`}>{risk.level}</span>
                      <span className="text-sm text-gray-500">{risk.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market-intelligence' && (
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Geographic Risk Analysis</h2>
                <p className="text-sm text-gray-600 mt-1">AI-powered market intelligence for pincode-based risk assessment</p>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enter Pincode</label>
                      <input
                        type="text"
                        placeholder="e.g., 400001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <MapPin size={16} />
                      Analyze Location
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Sample Analysis: 400001</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="font-medium text-orange-600">HIGH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fraud Rate:</span>
                        <span className="font-medium">8.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sample Size:</span>
                        <span className="font-medium">1,247 cases</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium text-green-600">96.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* High Risk Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">High Risk Areas</h3>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    { pincode: '400001', city: 'Mumbai', risk: 8.3, cases: 1247 },
                    { pincode: '110001', city: 'Delhi', risk: 7.8, cases: 892 },
                    { pincode: '560001', city: 'Bangalore', risk: 6.9, cases: 1034 },
                    { pincode: '600001', city: 'Chennai', risk: 6.2, cases: 756 },
                    { pincode: '700001', city: 'Kolkata', risk: 5.8, cases: 623 },
                    { pincode: '500001', city: 'Hyderabad', risk: 5.4, cases: 445 }
                  ].map((area, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{area.pincode}</h4>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">HIGH RISK</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{area.city}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fraud Rate:</span>
                          <span className="font-medium text-red-600">{area.risk}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cases:</span>
                          <span className="font-medium">{area.cases.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customer-search' && (
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Similar Customer Analysis</h2>
                <p className="text-sm text-gray-600 mt-1">Find customers with similar risk profiles using advanced similarity algorithms</p>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
                      <input
                        type="text"
                        placeholder="e.g., CUST-12345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Similarity Threshold</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="0.8">High (0.8+)</option>
                        <option value="0.6">Medium (0.6+)</option>
                        <option value="0.4">Low (0.4+)</option>
                      </select>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Search size={16} />
                      Find Similar Customers
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Sample Results: CUST-12345</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'CUST-67890', similarity: 0.94, risk: 'HIGH', status: 'Known Fraud' },
                        { id: 'CUST-54321', similarity: 0.87, risk: 'MEDIUM', status: 'Under Review' },
                        { id: 'CUST-98765', similarity: 0.82, risk: 'HIGH', status: 'Flagged' }
                      ].map((customer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <p className="font-medium text-gray-900">{customer.id}</p>
                            <p className="text-xs text-gray-500">Similarity: {customer.similarity}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              customer.risk === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {customer.risk}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{customer.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Algorithm Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Algorithm Details</h3>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Similarity Factors</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        'Financial Profile Matching',
                        'Geographic Proximity',
                        'Document Verification Patterns',
                        'Digital Footprint Similarity',
                        'Employment History Alignment'
                      ].map((factor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precision:</span>
                        <span className="font-medium">92.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recall:</span>
                        <span className="font-medium">89.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">F1-Score:</span>
                        <span className="font-medium">91.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Speed:</span>
                        <span className="font-medium">~500ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;