import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useBatch } from '../hooks/useBatch';
import StepIndicator from '../components/ui/StepIndicator';
import ProcessingButton from '../components/ui/ProcessingButton';
import { RiskDistributionChart, FeatureImportanceChart } from '../components/Charts';

const FraudDetection = () => {
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
            <h2 className="text-xl font-bold text-gray-900">Step 1: Fraud Detection</h2>
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
  );
};

export default FraudDetection;