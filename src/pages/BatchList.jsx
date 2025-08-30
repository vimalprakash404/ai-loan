import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import FileUpload from '../components/ui/FileUpload';
import BatchStats from '../components/ui/BatchStats';
import BatchCard from '../components/ui/BatchCard';
import { FraudTrendChart, ModelPerformanceChart } from '../components/Charts';

const BatchList = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const { batches, setBatches } = useAppContext();

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
    navigate(`/batch/${newBatch.id}/fraud-detection`);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <FileUpload 
        uploadedFile={uploadedFile}
        onFileUpload={handleFileUpload}
        onCreateBatch={createNewBatch}
      />

      <BatchStats batches={batches} />

      {/* Batch List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Batches</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
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
  );
};

export default BatchList;