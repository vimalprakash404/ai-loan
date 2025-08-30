import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useBatch } from '../hooks/useBatch';
import StepIndicator from '../components/ui/StepIndicator';
import ProcessingButton from '../components/ui/ProcessingButton';
import { SimilarityAnalysisChart, ProcessingTimeChart } from '../components/Charts';

const CustomerSearch = () => {
  const { currentStep, isProcessing, processStep } = useAppContext();
  const { selectedBatch, batchId } = useBatch();

  if (!selectedBatch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Batch not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Batch Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Step 3: Customer Search</h2>
            <p className="text-gray-600">Batch: {selectedBatch.name} ({selectedBatch.id})</p>
          </div>
          
          <div className="flex items-center gap-3">
            <ProcessingButton
              currentStep={currentStep}
              selectedBatch={selectedBatch}
              isProcessing={isProcessing}
              onProcessStep={() => processStep(batchId)}
              onNextStep={() => {}}
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
  );
};

export default CustomerSearch;