import React, { useState } from 'react';
import { Shield, Upload, BarChart3, Users, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, MapPin, Search, FileText, Download, Eye, Plus, PlayCircle, Pause, RotateCcw } from 'lucide-react';
import { 
  RiskDistributionChart, 
  FraudTrendChart, 
  ModelPerformanceChart, 
  GeographicRiskChart, 
  GeographicHeatmapChart, 
  SimilarityAnalysisChart, 
  ProcessingTimeChart, 
  RealTimeMonitoringChart,
  FeatureImportanceChart 
} from './components/Charts';

const App = () => {
  const [activeTab, setActiveTab] = useState('batches');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample batch data
  const [batches, setBatches] = useState([
    {
      id: 'BATCH-001',
      name: 'Customer Applications - Q1 2025',
      uploadDate: '2025-01-15',
      totalRecords: 1247,
      status: 'completed',
      currentStep: 3,
      results: {
        fraudDetection: { processed: 1247, fraudDetected: 89, accuracy: 94.7 },
        marketIntel: { analyzed: 1247, highRiskAreas: 12, avgRiskScore: 6.2 },
        customerSearch: { processed: 1247, similarityMatches: 156, avgSimilarity: 0.73 }
      }
    },
    {
      id: 'BATCH-002',
      name: 'Loan Applications - December',
      uploadDate: '2024-12-28',
      totalRecords: 892,
      status: 'processing',
      currentStep: 2,
      results: {
        fraudDetection: { processed: 892, fraudDetected: 67, accuracy: 93.2 },
        marketIntel: { analyzed: 450, highRiskAreas: 8, avgRiskScore: 5.8 },
        customerSearch: null
      }
    },
    {
      id: 'BATCH-003',
      name: 'Insurance Claims - January',
      uploadDate: '2025-01-10',
      totalRecords: 2156,
      status: 'pending',
      currentStep: 1,
      results: {
        fraudDetection: null,
        marketIntel: null,
        customerSearch: null
      }
    }
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
    }
  };

  const createNewBatch = () => {
    if (!uploadedFile) return;
    
    const newBatch = {
      id: `BATCH-${String(batches.length + 1).padStart(3, '0')}`,
      name: uploadedFile.name.replace('.csv', ''),
      uploadDate: new Date().toISOString().split('T')[0],
      totalRecords: Math.floor(Math.random() * 2000) + 500,
      status: 'pending',
      currentStep: 1,
      results: {
        fraudDetection: null,
        marketIntel: null,
        customerSearch: null
      }
    };
    
    setBatches([newBatch, ...batches]);
    setUploadedFile(null);
    setSelectedBatch(newBatch);
    setCurrentStep(1);
    setActiveTab('fraud-detection');
  };

  const processStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedBatches = batches.map(batch => {
        if (batch.id === selectedBatch.id) {
          const updatedBatch = { ...batch };
          
          if (currentStep === 1) {
            updatedBatch.results.fraudDetection = {
              processed: batch.totalRecords,
              fraudDetected: Math.floor(batch.totalRecords * 0.07),
              accuracy: 94.7
            };
            updatedBatch.currentStep = 2;
          } else if (currentStep === 2) {
            updatedBatch.results.marketIntel = {
              analyzed: batch.totalRecords,
              highRiskAreas: Math.floor(Math.random() * 15) + 5,
              avgRiskScore: (Math.random() * 3 + 4).toFixed(1)
            };
            updatedBatch.currentStep = 3;
          } else if (currentStep === 3) {
            updatedBatch.results.customerSearch = {
              processed: batch.totalRecords,
              similarityMatches: Math.floor(batch.totalRecords * 0.12),
              avgSimilarity: (Math.random() * 0.3 + 0.6).toFixed(2)
            };
            updatedBatch.status = 'completed';
          }
          
          return updatedBatch;
        }
        return batch;
      });
      
      setBatches(updatedBatches);
      setSelectedBatch(updatedBatches.find(b => b.id === selectedBatch.id));
      
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
      setIsProcessing(false);
    }, 2000);
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick, disabled = false }) => (
    <button
      onClick={() => !disabled && onClick(id)}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
        disabled 
          ? 'text-gray-400 cursor-not-allowed'
          : isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const StepIndicator = ({ stepNumber, title, isActive, isCompleted, isDisabled }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
      isActive ? 'border-blue-500 bg-blue-50' :
      isCompleted ? 'border-green-500 bg-green-50' :
      isDisabled ? 'border-gray-200 bg-gray-50' : 'border-gray-200'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        isActive ? 'bg-blue-500 text-white' :
        isCompleted ? 'bg-green-500 text-white' :
        isDisabled ? 'bg-gray-300 text-gray-500' : 'bg-gray-200 text-gray-600'
      }`}>
        {isCompleted ? <CheckCircle size={16} /> : stepNumber}
      </div>
      <div>
        <h4 className={`font-semibold ${
          isActive ? 'text-blue-900' :
          isCompleted ? 'text-green-900' :
          isDisabled ? 'text-gray-500' : 'text-gray-700'
        }`}>{title}</h4>
        <p className={`text-xs ${
          isActive ? 'text-blue-700' :
          isCompleted ? 'text-green-700' :
          isDisabled ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {isActive ? 'In Progress' : isCompleted ? 'Completed' : 'Pending'}
        </p>
      </div>
    </div>
  );

  const BatchCard = ({ batch, onSelect }) => (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{batch.name}</h3>
            <p className="text-sm text-gray-500">{batch.id}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            batch.status === 'completed' ? 'bg-green-100 text-green-700' :
            batch.status === 'processing' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {batch.status.toUpperCase()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Upload Date</p>
            <p className="font-medium text-gray-900">{batch.uploadDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Records</p>
            <p className="font-medium text-gray-900">{batch.totalRecords.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{batch.currentStep}/3 Steps</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(step => (
              <div 
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  step <= batch.currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Fraud Detection</span>
            <span>Market Intel</span>
            <span>Customer Search</span>
          </div>
        </div>

        {batch.status === 'completed' && batch.results.fraudDetection && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Fraud Detected</p>
                <p className="font-bold text-red-600">{batch.results.fraudDetection.fraudDetected}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Risk Areas</p>
                <p className="font-bold text-orange-600">{batch.results.marketIntel?.highRiskAreas || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Similarities</p>
                <p className="font-bold text-purple-600">{batch.results.customerSearch?.similarityMatches || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* View Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              onSelect(batch);
              setActiveTab('fraud-detection');
              setCurrentStep(batch.currentStep);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye size={16} />
            View Batch
          </button>
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
              {selectedBatch && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{selectedBatch.id}</span>
                  <span className="text-gray-400">•</span>
                  <span>Step {currentStep}/3</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
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
      {selectedBatch && (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 py-3 overflow-x-auto">
              <TabButton
                id="batches"
                label="← Back to Batches"
                icon={FileText}
                isActive={activeTab === 'batches'}
                onClick={() => {
                  setActiveTab('batches');
                  setSelectedBatch(null);
                  setCurrentStep(1);
                }}
              />
              <TabButton
                id="fraud-detection"
                label="Step 1: Fraud Detection"
                icon={Shield}
                isActive={activeTab === 'fraud-detection'}
                onClick={setActiveTab}
              />
              <TabButton
                id="market-intelligence"
                label="Step 2: Market Intel"
                icon={MapPin}
                isActive={activeTab === 'market-intelligence'}
                onClick={setActiveTab}
              />
              <TabButton
                id="customer-search"
                label="Step 3: Customer Search"
                icon={Search}
                isActive={activeTab === 'customer-search'}
                onClick={setActiveTab}
              />
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {activeTab === 'batches' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Header with Upload */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Batch Processing</h2>
                <p className="text-gray-600 mt-1">Manage and monitor your fraud detection batches</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="batch-upload"
                  />
                  <label
                    htmlFor="batch-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Upload size={16} />
                    Upload CSV
                  </label>
                </div>
                
                {uploadedFile && (
                  <button
                    onClick={createNewBatch}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Create Batch
                  </button>
                )}
              </div>
            </div>

            {uploadedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                    <p className="text-sm text-blue-700">{(uploadedFile.size / 1024).toFixed(1)} KB • Ready to create batch</p>
                  </div>
                </div>
              </div>
            )}

            {/* Batch Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">{batches.length}</h3>
                <p className="text-sm text-gray-600">Total Batches</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                  {batches.filter(b => b.status === 'completed').length}
                </h3>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                  {batches.filter(b => b.status === 'processing').length}
                </h3>
                <p className="text-sm text-gray-600">Processing</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Pause className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                  {batches.filter(b => b.status === 'pending').length}
                </h3>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>

            {/* Batch List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Batches</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {batches.map((batch) => (
                  <BatchCard key={batch.id} batch={batch} onSelect={setSelectedBatch} />
                ))}
              </div>
            </div>

            {/* Overall Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 lg:p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Batch Processing Trends</h3>
                </div>
                <div className="p-4 lg:p-6">
                  <FraudTrendChart />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 lg:p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">System Performance</h3>
                </div>
                <div className="p-4 lg:p-6">
                  <ModelPerformanceChart />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fraud-detection' && selectedBatch && (
          <div className="space-y-6 lg:space-y-8">
            {/* Batch Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Step 1: Fraud Detection</h2>
                  <p className="text-gray-600">Batch: {selectedBatch.name} ({selectedBatch.id})</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentStep === 1 && !selectedBatch.results.fraudDetection && (
                    <button
                      onClick={processStep}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <PlayCircle size={16} />
                          Start Analysis
                        </>
                      )}
                    </button>
                  )}
                  
                  {selectedBatch.results.fraudDetection && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={20} />
                      <span className="font-semibold">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <StepIndicator
                stepNumber={1}
                title="Fraud Detection"
                isActive={currentStep === 1}
                isCompleted={selectedBatch.results.fraudDetection !== null}
                isDisabled={false}
              />
              <StepIndicator
                stepNumber={2}
                title="Market Intelligence"
                isActive={currentStep === 2}
                isCompleted={selectedBatch.results.marketIntel !== null}
                isDisabled={selectedBatch.results.fraudDetection === null}
              />
              <StepIndicator
                stepNumber={3}
                title="Customer Search"
                isActive={currentStep === 3}
                isCompleted={selectedBatch.results.customerSearch !== null}
                isDisabled={selectedBatch.results.marketIntel === null}
              />
            </div>

            {/* Results */}
            {selectedBatch.results.fraudDetection && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Records Processed</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedBatch.results.fraudDetection.processed.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Fraud Detected</p>
                    <p className="text-2xl font-bold text-red-600">{selectedBatch.results.fraudDetection.fraudDetected}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Model Accuracy</p>
                    <p className="text-2xl font-bold text-green-600">{selectedBatch.results.fraudDetection.accuracy}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Distribution</h3>
                    <RiskDistributionChart />
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Importance</h3>
                    <FeatureImportanceChart />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'market-intelligence' && selectedBatch && (
          <div className="space-y-6 lg:space-y-8">
            {/* Batch Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Step 2: Market Intelligence</h2>
                  <p className="text-gray-600">Batch: {selectedBatch.name} ({selectedBatch.id})</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentStep === 2 && !selectedBatch.results.marketIntel && (
                    <button
                      onClick={processStep}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <PlayCircle size={16} />
                          Start Analysis
                        </>
                      )}
                    </button>
                  )}
                  
                  {selectedBatch.results.marketIntel && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={20} />
                      <span className="font-semibold">Completed</span>
                    </div>
                  )}
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
              />
              <StepIndicator
                stepNumber={2}
                title="Market Intelligence"
                isActive={currentStep === 2}
                isCompleted={selectedBatch.results.marketIntel !== null}
                isDisabled={selectedBatch.results.fraudDetection === null}
              />
              <StepIndicator
                stepNumber={3}
                title="Customer Search"
                isActive={false}
                isCompleted={selectedBatch.results.customerSearch !== null}
                isDisabled={selectedBatch.results.marketIntel === null}
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

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Risk Analysis</h3>
                    <GeographicRiskChart />
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Regional Heatmap</h3>
                    <GeographicHeatmapChart />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customer-search' && selectedBatch && (
          <div className="space-y-6 lg:space-y-8">
            {/* Batch Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Step 3: Customer Search</h2>
                  <p className="text-gray-600">Batch: {selectedBatch.name} ({selectedBatch.id})</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentStep === 3 && !selectedBatch.results.customerSearch && (
                    <button
                      onClick={processStep}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <PlayCircle size={16} />
                          Start Search
                        </>
                      )}
                    </button>
                  )}
                  
                  {selectedBatch.results.customerSearch && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={20} />
                      <span className="font-semibold">Completed</span>
                    </div>
                  )}
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
              />
              <StepIndicator
                stepNumber={2}
                title="Market Intelligence"
                isActive={false}
                isCompleted={selectedBatch.results.marketIntel !== null}
                isDisabled={selectedBatch.results.fraudDetection === null}
              />
              <StepIndicator
                stepNumber={3}
                title="Customer Search"
                isActive={currentStep === 3}
                isCompleted={selectedBatch.results.customerSearch !== null}
                isDisabled={selectedBatch.results.marketIntel === null}
              />
            </div>

            {/* Results */}
            {selectedBatch.results.customerSearch && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Records Processed</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedBatch.results.customerSearch.processed.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Similarity Matches</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedBatch.results.customerSearch.similarityMatches}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Avg Similarity</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedBatch.results.customerSearch.avgSimilarity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Similarity Analysis</h3>
                    <SimilarityAnalysisChart />
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Processing Time</h3>
                    <ProcessingTimeChart />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;