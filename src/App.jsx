import React, { useState } from 'react';
import { Upload, Play, Shield, MapPin, Users, AlertTriangle, CheckCircle, Eye, EyeOff, Download, RotateCcw, Brain, TrendingUp, Search } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('batch-list');
  const [user, setUser] = useState(null);
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: 'Batch 001 - Mumbai Applications',
      uploadDate: '2025-01-15',
      recordCount: 150,
      status: 'completed',
      fraudDetected: 23,
      highRisk: 45
    },
    {
      id: 2,
      name: 'Batch 002 - Delhi Applications',
      uploadDate: '2025-01-14',
      recordCount: 89,
      status: 'completed',
      fraudDetected: 12,
      highRisk: 28
    },
    {
      id: 3,
      name: 'Batch 003 - Bangalore Applications',
      uploadDate: '2025-01-13',
      recordCount: 203,
      status: 'processing',
      fraudDetected: 0,
      highRisk: 0
    }
  ]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fraudDetectionResults, setFraudDetectionResults] = useState([]);
  const [marketIntelligenceResults, setMarketIntelligenceResults] = useState([]);
  const [similarCustomerResults, setSimilarCustomerResults] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [totalBatches, setTotalBatches] = useState(1);

  // Parse CSV data with fraud detection fields
  const processUploadedFile = (file) => {
    // Mock CSV parsing - in real app would use Papa Parse or similar
    const mockData = [
      {
        customer_id: 'CUST_000012',
        city: 'Chennai',
        pincode: '994751',
        document_quality_score: 0.168,
        document_consistency_score: 0.144,
        biometric_verification_score: 0.155,
        address_verification_result: 'Partial',
        identity_match_score: 0.401,
        document_metadata_consistency: 0.149,
        income_verification_result: 'Verified',
        income_profession_alignment: 0.424,
        banking_history_months: 25,
        financial_distress_indicators: 6,
        credit_score: 607,
        debt_to_income_ratio: 0.819,
        premium_to_income_ratio: 0.308,
        social_media_presence_score: 0.292,
        digital_footprint_consistency: 0.145,
        employment_verification_result: 'Not Verified',
        professional_credential_validation: 'Invalid',
        digital_presence_age_months: 115,
        digital_reputation_score: 0.057,
        identity_verification_composite: 0.217,
        financial_risk_score: 0.523,
        digital_consistency_score: 0.165,
        identity_financial_mismatch: 0.261,
        is_fraud: 0
      },
      {
        customer_id: 'CUST_000022',
        city: 'Lucknow',
        pincode: '559297',
        document_quality_score: 0.194,
        document_consistency_score: 0.114,
        biometric_verification_score: 0.119,
        address_verification_result: 'Fail',
        identity_match_score: 0.224,
        document_metadata_consistency: 0.138,
        income_verification_result: 'Verified',
        income_profession_alignment: 0.175,
        banking_history_months: 9,
        financial_distress_indicators: 3,
        credit_score: 643,
        debt_to_income_ratio: 0.65,
        premium_to_income_ratio: 0.485,
        social_media_presence_score: 0.649,
        digital_footprint_consistency: 0.412,
        employment_verification_result: 'Not Verified',
        professional_credential_validation: 'Not Applicable',
        digital_presence_age_months: 3,
        digital_reputation_score: 0.349,
        identity_verification_composite: 0.163,
        financial_risk_score: 0.504,
        digital_consistency_score: 0.47,
        identity_financial_mismatch: 0.334,
        is_fraud: 1
      },
      {
        customer_id: 'CUST_000035',
        city: 'Kolkata',
        pincode: '110075',
        document_quality_score: 0.241,
        document_consistency_score: 0.337,
        biometric_verification_score: 0.072,
        address_verification_result: 'Pass',
        identity_match_score: 0.378,
        document_metadata_consistency: 0.264,
        income_verification_result: 'Not Verified',
        income_profession_alignment: 0.319,
        banking_history_months: 37,
        financial_distress_indicators: 6,
        credit_score: 628,
        debt_to_income_ratio: 0.913,
        premium_to_income_ratio: 0.243,
        social_media_presence_score: 0.314,
        digital_footprint_consistency: 0.394,
        employment_verification_result: 'Not Verified',
        professional_credential_validation: 'Invalid',
        digital_presence_age_months: 7,
        digital_reputation_score: 0.84,
        identity_verification_composite: 0.257,
        financial_risk_score: 0.52,
        digital_consistency_score: 0.516,
        identity_financial_mismatch: 0.223,
        is_fraud: 1
      }
    ];

    const validData = [];
    const validationErrors = [];

    mockData.forEach((row, index) => {
      const rowErrors = [];
      
      if (!row.customer_id) {
        rowErrors.push(`Row ${index + 1}: Customer ID is required`);
      }
      if (!row.city || !row.pincode) {
        rowErrors.push(`Row ${index + 1}: City and Pincode are required`);
      }
      if (row.credit_score < 300 || row.credit_score > 850) {
        rowErrors.push(`Row ${index + 1}: Credit score must be between 300-850`);
      }

      if (rowErrors.length === 0) {
        validData.push(row);
      } else {
        validationErrors.push(...rowErrors);
      }
    });

    setUploadedData(validData);
    setErrors(validationErrors);
    setCurrentStep('display-data');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Step 1: Fraud Detection Model
  const runFraudDetection = () => {
    const results = uploadedData.map(customer => {
      // Mock Random Forest prediction
      const features = [
        customer.document_quality_score,
        customer.document_consistency_score,
        customer.biometric_verification_score,
        customer.identity_match_score,
        customer.financial_risk_score,
        customer.digital_consistency_score
      ];
      
      const fraudProbability = Math.random(); // Mock ML prediction
      
      let riskCategory = '';
      if (fraudProbability >= 0.8) riskCategory = 'CRITICAL';
      else if (fraudProbability >= 0.6) riskCategory = 'HIGH';
      else if (fraudProbability >= 0.4) riskCategory = 'MEDIUM';
      else if (fraudProbability >= 0.2) riskCategory = 'LOW';
      else riskCategory = 'MINIMAL';

      return {
        ...customer,
        fraudProbability: Math.round(fraudProbability * 1000) / 1000,
        riskCategory,
        documentQualityFlag: customer.document_quality_score < 0.3,
        financialRiskFlag: customer.financial_risk_score > 0.7,
        digitalInconsistencyFlag: customer.digital_consistency_score < 0.3
      };
    });

    setFraudDetectionResults(results);
    setCurrentStep('fraud-detection');
  };

  // Step 2: Market Intelligence
  const runMarketIntelligence = () => {
    const results = fraudDetectionResults.map(customer => {
      // Mock geographic risk analysis
      const knownHotspots = ['994751', '559297', '110075'];
      const isHotspot = knownHotspots.includes(customer.pincode);
      
      const geographicRisk = isHotspot ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4;
      const marketInsight = isHotspot ? 
        'High fraud activity reported in this area. Enhanced verification recommended.' :
        'Standard risk area with normal fraud patterns.';
      
      let priorityScore = 0;
      if (geographicRisk > 0.7) priorityScore = 5;
      else if (geographicRisk > 0.5) priorityScore = 4;
      else if (geographicRisk > 0.3) priorityScore = 3;
      else if (geographicRisk > 0.1) priorityScore = 2;
      else priorityScore = 1;

      return {
        ...customer,
        geographicRisk: Math.round(geographicRisk * 1000) / 1000,
        isKnownHotspot: isHotspot,
        marketInsight,
        priorityScore,
        aiRecommendation: geographicRisk > 0.6 ? 'Immediate review required' : 'Standard processing'
      };
    });

    setMarketIntelligenceResults(results);
    setCurrentStep('market-intelligence');
  };

  // Step 3: Similar Customer Search
  const runSimilarCustomerSearch = () => {
    const results = marketIntelligenceResults.map(customer => {
      // Mock cosine similarity calculation
      const similarityScore = Math.random();
      const matchedCustomers = Math.floor(Math.random() * 5) + 1;
      const fraudMatches = Math.floor(Math.random() * matchedCustomers);
      
      const riskFromSimilarity = fraudMatches / matchedCustomers;
      
      return {
        ...customer,
        similarityScore: Math.round(similarityScore * 1000) / 1000,
        matchedCustomers,
        fraudMatches,
        riskFromSimilarity: Math.round(riskFromSimilarity * 1000) / 1000,
        finalRiskScore: Math.round(((customer.fraudProbability + customer.geographicRisk + riskFromSimilarity) / 3) * 1000) / 1000,
        recommendation: riskFromSimilarity > 0.5 ? 'Reject - High similarity to known fraudsters' : 
                       riskFromSimilarity > 0.3 ? 'Manual review required' : 'Approve with monitoring'
      };
    });

    setSimilarCustomerResults(results);
    setCurrentStep('final-results');
  };

  const logout = () => {
    setUser(null);
    setCurrentStep('batch-list');
    resetAllData();
  };

  const resetAllData = () => {
    setUploadedData([]);
    setErrors([]);
    setFraudDetectionResults([]);
    setMarketIntelligenceResults([]);
    setSimilarCustomerResults([]);
  };

  const startNewBatch = () => {
    setCurrentStep('upload');
    resetAllData();
  };

  const viewBatchDetails = (batch) => {
    setSelectedBatch(batch);
    // Load mock data for the selected batch
    processUploadedFile(null); // This will load the mock data
    setCurrentStep('display-data');
  };

  const createNewBatch = () => {
    setSelectedBatch(null);
    setCurrentStep('upload');
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const csvContent = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    ).join('\n');
    
    const csv = headers + '\n' + csvContent;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch List Component
  if (currentStep === 'batch-list') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-red-600" />
                <h1 className="text-2xl font-bold text-gray-900">Fraud Detection System</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">ML-Powered Risk Analysis</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Upload New Batch Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload New Batch</h2>
              <p className="text-gray-600 mb-6">
                Process customer data through our 3-step ML fraud detection pipeline
              </p>
              
              <button
                onClick={createNewBatch}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 font-medium inline-flex items-center text-lg transition-colors"
              >
                <Upload className="w-6 h-6 mr-3" />
                Upload CSV File
              </button>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-4">
                  <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900">Step 1: Fraud Detection</h3>
                  <p className="text-blue-700">Random Forest ML model</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-purple-900">Step 2: Market Intelligence</h3>
                  <p className="text-purple-700">Geographic risk analysis</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <Search className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-900">Step 3: Similar Customers</h3>
                  <p className="text-green-700">Cosine similarity matching</p>
                </div>
              </div>
            </div>
          </div>

          {/* Batch History */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Previous Batches</h2>
              <p className="text-gray-600">View and analyze previously processed batches</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {batches.map((batch) => (
                <div key={batch.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          batch.status === 'completed' ? 'bg-green-500' : 
                          batch.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{batch.name}</h3>
                          <p className="text-sm text-gray-500">
                            Uploaded on {new Date(batch.uploadDate).toLocaleDateString()} • {batch.recordCount} records
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium text-red-600">{batch.fraudDetected}</span> fraud detected
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium text-orange-600">{batch.highRisk}</span> high risk
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            batch.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            batch.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {batch.status === 'completed' ? 'Completed' : 
                             batch.status === 'processing' ? 'Processing' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {batch.status === 'completed' && (
                        <button
                          onClick={() => viewBatchDetails(batch)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium inline-flex items-center text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      )}
                      {batch.status === 'processing' && (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                          <span className="text-sm font-medium">Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {batches.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No batches yet</h3>
                <p className="text-gray-500">Upload your first CSV file to get started with fraud detection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-xl font-semibold text-gray-900">Fraud Detection System</h1>
              {currentBatch > 1 && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Batch {currentBatch}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {selectedBatch && (
                <span className="text-gray-700">Analyzing: {selectedBatch.name}</span>
              )}
              {currentStep !== 'upload' && (
                <button
                  onClick={() => setCurrentStep('batch-list')}
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Batches
                </button>
              )}
              {currentStep !== 'upload' && currentStep !== 'batch-list' && (
                <button
                  onClick={startNewBatch}
                  className="text-green-600 hover:text-green-800 font-medium inline-flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  New Batch
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        {currentStep !== 'batch-list' && <div className="mb-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {['upload', 'display-data', 'fraud-detection', 'market-intelligence', 'similar-customer', 'final-results'].map((step, index) => {
              const stepNames = ['Upload CSV', 'Validate Data', 'Fraud Detection', 'Market Intelligence', 'Similar Customers', 'Final Results'];
              const stepIcons = [Upload, Eye, Shield, MapPin, Search, CheckCircle];
              const StepIcon = stepIcons[index];
              const isActive = currentStep === step;
              const isCompleted = ['upload', 'display-data', 'fraud-detection', 'market-intelligence', 'similar-customer', 'final-results'].indexOf(currentStep) > index;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-red-600 text-white' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
                    {stepNames[index]}
                  </span>
                  {index < 5 && <div className="w-8 h-0.5 bg-gray-300 ml-4" />}
                </div>
              );
            })}
          </div>
        </div>}

        {/* Upload Step */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <Upload className="mx-auto w-16 h-16 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Customer Data</h2>
              <p className="text-gray-600 mb-2">
                Creating Batch {batches.length + 1}
              </p>
              <p className="text-gray-500 mb-6">
                Upload CSV file with customer fraud detection features
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-red-400 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-900">Click to upload CSV</span>
                  <span className="text-gray-500">Supports CSV files with 26 fraud detection features</span>
                </label>
              </div>

              <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Required CSV Columns:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• customer_id</div>
                  <div>• city</div>
                  <div>• pincode</div>
                  <div>• document_quality_score</div>
                  <div>• biometric_verification_score</div>
                  <div>• financial_risk_score</div>
                  <div>• credit_score</div>
                  <div>• digital_consistency_score</div>
                  <div>• is_fraud (0/1)</div>
                  <div>• ... and 17 more features</div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setCurrentStep('batch-list')}
                  className="text-gray-600 hover:text-gray-800 font-medium inline-flex items-center"
                >
                  ← Back to Batches
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display Data Step */}
        {currentStep === 'display-data' && (
          <div className="space-y-6">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-medium text-red-800">Validation Errors</h3>
                </div>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Customer Data Validation</h2>
                    {selectedBatch && (
                      <p className="text-sm text-gray-500">{selectedBatch.name}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{uploadedData.length} valid records</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doc Quality</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Financial Risk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual Fraud</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {uploadedData.map((row) => (
                      <tr key={row.customer_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.customer_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.city}, {row.pincode}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.credit_score}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.document_quality_score.toFixed(3)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.financial_risk_score.toFixed(3)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            row.is_fraud ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {row.is_fraud ? 'Fraud' : 'Legitimate'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-center">
                <button
                  onClick={runFraudDetection}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium inline-flex items-center"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Run Fraud Detection Model
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Detection Results */}
        {currentStep === 'fraud-detection' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical Risk</p>
                    <p className="text-2xl font-bold text-red-600">
                      {fraudDetectionResults.filter(r => r.riskCategory === 'CRITICAL').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Risk</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {fraudDetectionResults.filter(r => r.riskCategory === 'HIGH').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Medium Risk</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {fraudDetectionResults.filter(r => r.riskCategory === 'MEDIUM').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low/Minimal</p>
                    <p className="text-2xl font-bold text-green-600">
                      {fraudDetectionResults.filter(r => r.riskCategory === 'LOW' || r.riskCategory === 'MINIMAL').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-red-600" />
                  Fraud Detection Results
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fraud Probability</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key Flags</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {fraudDetectionResults.map((result) => (
                      <tr key={result.customer_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{result.customer_id}</div>
                          <div className="text-sm text-gray-500">{result.city}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-red-600">{(result.fraudProbability * 100).toFixed(1)}%</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.riskCategory === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            result.riskCategory === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                            result.riskCategory === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            result.riskCategory === 'LOW' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {result.riskCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {result.documentQualityFlag && (
                              <span className="inline-flex px-1 py-0.5 text-xs bg-red-100 text-red-700 rounded">Doc</span>
                            )}
                            {result.financialRiskFlag && (
                              <span className="inline-flex px-1 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">Fin</span>
                            )}
                            {result.digitalInconsistencyFlag && (
                              <span className="inline-flex px-1 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">Dig</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.is_fraud ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {result.is_fraud ? 'Fraud' : 'Legitimate'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-center">
                <button
                  onClick={runMarketIntelligence}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium inline-flex items-center"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Run Market Intelligence
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Market Intelligence Results */}
        {currentStep === 'market-intelligence' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Geographic Risk Analysis
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geographic Risk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotspot</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {marketIntelligenceResults.map((result) => (
                      <tr key={result.customer_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{result.customer_id}</div>
                          <div className="text-sm text-gray-500">Priority: {result.priorityScore}/5</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {result.city}, {result.pincode}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-blue-600">{(result.geographicRisk * 100).toFixed(1)}%</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.isKnownHotspot ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {result.isKnownHotspot ? 'Known Hotspot' : 'Standard Area'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          {result.aiRecommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-center">
                <button
                  onClick={runSimilarCustomerSearch}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium inline-flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Run Similar Customer Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Similar Customer Results */}
        {currentStep === 'similar-customer' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Search className="w-6 h-6 mr-2 text-purple-600" />
                  Similar Customer Analysis
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Similarity Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matched Customers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fraud Matches</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk from Similarity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {similarCustomerResults.map((result) => (
                      <tr key={result.customer_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{result.customer_id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-purple-600">
                          {(result.similarityScore * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {result.matchedCustomers}
                        </td>
                        <td className="px-6 py-4 text-sm text-red-600 font-medium">
                          {result.fraudMatches}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-orange-600">
                          {(result.riskFromSimilarity * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-center">
                <button
                  onClick={() => setCurrentStep('final-results')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium inline-flex items-center"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Final Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final Results */}
        {currentStep === 'final-results' && (
          <div className="space-y-6">
            {/* Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Analyzed</p>
                    <p className="text-2xl font-bold text-gray-900">{similarCustomerResults.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Risk Detected</p>
                    <p className="text-2xl font-bold text-red-600">
                      {similarCustomerResults.filter(r => r.finalRiskScore > 0.6).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recommended Approvals</p>
                    <p className="text-2xl font-bold text-green-600">
                      {similarCustomerResults.filter(r => r.recommendation.includes('Approve')).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Results Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Comprehensive Fraud Analysis</h2>
                <button
                  onClick={() => exportToCSV(similarCustomerResults.map(r => ({
                    CustomerID: r.customer_id,
                    City: r.city,
                    Pincode: r.pincode,
                    FraudProbability: r.fraudProbability,
                    RiskCategory: r.riskCategory,
                    GeographicRisk: r.geographicRisk,
                    SimilarityRisk: r.riskFromSimilarity,
                    FinalRiskScore: r.finalRiskScore,
                    Recommendation: r.recommendation,
                    ActualFraud: r.is_fraud
                  })), `fraud-analysis-batch-${currentBatch}-${new Date().toISOString().split('T')[0]}.csv`)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium inline-flex items-center text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export Results
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ML Fraud Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geographic Risk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Similarity Risk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {similarCustomerResults.map((result) => (
                      <tr key={result.customer_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{result.customer_id}</div>
                          <div className="text-sm text-gray-500">{result.city}, {result.pincode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-red-600">{(result.fraudProbability * 100).toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">{result.riskCategory}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-blue-600">{(result.geographicRisk * 100).toFixed(1)}%</div>
                          {result.isKnownHotspot && (
                            <div className="text-xs text-red-600">Hotspot</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-purple-600">{(result.riskFromSimilarity * 100).toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">{result.fraudMatches}/{result.matchedCustomers} matches</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-bold ${
                            result.finalRiskScore > 0.7 ? 'text-red-600' :
                            result.finalRiskScore > 0.5 ? 'text-orange-600' :
                            result.finalRiskScore > 0.3 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {(result.finalRiskScore * 100).toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.recommendation.includes('Reject') ? 'bg-red-100 text-red-800' :
                            result.recommendation.includes('Manual') ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {result.recommendation.split(' ')[0]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.is_fraud ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {result.is_fraud ? 'Fraud' : 'Legitimate'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Analysis complete for {selectedBatch?.name || `batch ${currentBatch}`}
                </div>
                <button
                  onClick={() => {
                    setCurrentBatch(currentBatch + 1);
                    startNewBatch();
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium inline-flex items-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Process New Batch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;