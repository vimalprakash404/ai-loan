import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const StepIndicator = ({ stepNumber, title, isActive, isCompleted, isDisabled, batchId, stepPath }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isDisabled && batchId && stepPath) {
      navigate(`/batch/${batchId}/${stepPath}`);
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
        isActive ? 'border-blue-500 bg-blue-50' :
        isCompleted ? 'border-green-500 bg-green-50' :
        isDisabled ? 'border-gray-200 bg-gray-50' : 'border-gray-200'
      } ${
        !isDisabled && stepPath ? 'cursor-pointer hover:shadow-md hover:scale-105' : 
        isDisabled ? 'cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
    >
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
          {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;