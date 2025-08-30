import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useBatch } from '../hooks/useBatch';
import StepIndicator from '../components/ui/StepIndicator';
import ProcessingButton from '../components/ui/ProcessingButton';
import MarketInsights from '../components/ui/MarketInsights';
import GeographicHeatmap from '../components/ui/GeographicHeatmap';
import RiskFactorAnalysis from '../components/ui/RiskFactorAnalysis';
import marketData from '../../marget.json';

const MarketIntelligence = () => {
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
            <h2 className="text-xl font-bold text-gray-900">Step 2: Market Intelligence</h2>
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

          {/* Market Intelligence Components */}
          <MarketInsights marketData={marketData} />
          <GeographicHeatmap marketData={marketData} />
          <RiskFactorAnalysis marketData={marketData} />
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;