import React from 'react';
import { PlayCircle, CheckCircle, TrendingUp, Search } from 'lucide-react';

const ProcessingButton = ({ 
  currentStep, 
  selectedBatch, 
  isProcessing, 
  onProcessStep, 
  onNextStep 
}) => {
  const getStepConfig = () => {
    switch (currentStep) {
      case 1:
        return {
          resultKey: 'fraudDetection',
          processingText: 'Processing...',
          startText: 'Start Analysis',
          nextText: 'Next: Market Intelligence',
          nextIcon: TrendingUp,
          nextPath: 'market-intelligence'
        };
      case 2:
        return {
          resultKey: 'marketIntel',
          processingText: 'Analyzing...',
          startText: 'Start Analysis',
          nextText: 'Next: Customer Search',
          nextIcon: Search,
          nextPath: 'customer-search'
        };
      case 3:
        return {
          resultKey: 'customerSearch',
          processingText: 'Searching...',
          startText: 'Start Search',
          nextText: 'All Steps Completed',
          nextIcon: CheckCircle,
          nextPath: null
        };
      default:
        return null;
    }
  };

  const config = getStepConfig();
  if (!config) return null;

  const hasResults = selectedBatch.results[config.resultKey];
  const NextIcon = config.nextIcon;

  if (!hasResults) {
    return (
      <button
        onClick={onProcessStep}
        disabled={isProcessing}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {config.processingText}
          </>
        ) : (
          <>
            <PlayCircle size={16} />
            {config.startText}
          </>
        )}
      </button>
    );
  }

  if (currentStep < 3 && config.nextPath) {
    return (
      <button
        onClick={() => onNextStep(config.nextPath)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <NextIcon size={16} />
        {config.nextText}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle size={20} />
      <span className="font-semibold">{config.nextText}</span>
    </div>
  );
};

export default ProcessingButton;