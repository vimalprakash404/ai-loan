import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const useBatch = () => {
  const { batchId } = useParams();
  const { batches, currentStep, setCurrentStep } = useAppContext();
  
  const selectedBatch = batches.find(batch => batch.id === batchId);
  
  // Update current step based on batch progress
  React.useEffect(() => {
    if (selectedBatch) {
      setCurrentStep(selectedBatch.currentStep);
    }
  }, [selectedBatch, setCurrentStep]);

  return {
    selectedBatch,
    batchId
  };
};