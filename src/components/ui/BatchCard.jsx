import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

const BatchCard = ({ batch }) => {
  const navigate = useNavigate();

  const handleViewBatch = () => {
    navigate(`/batch/${batch.id}/fraud-detection`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
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
            <span></span>
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
            onClick={handleViewBatch}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye size={16} />
            View Batch
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;