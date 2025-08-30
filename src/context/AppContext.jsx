import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const processStep = (batchId) => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedBatches = batches.map(batch => {
        if (batch.id === batchId) {
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
      
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
      setIsProcessing(false);
    }, 2000);
  };

  const value = {
    batches,
    setBatches,
    currentStep,
    setCurrentStep,
    isProcessing,
    processStep
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;