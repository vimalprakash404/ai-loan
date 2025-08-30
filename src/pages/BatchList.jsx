import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Upload, FileText } from 'lucide-react';
import BatchCard from '../components/ui/BatchCard';

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Customer Data</h3>
            <p className="text-gray-600">
              Upload your CSV file to start the 3-step ML-powered fraud detection analysis
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="main-file-upload"
            />
            <label
              htmlFor="main-file-upload"
              className="cursor-pointer block"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Drop your CSV file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports CSV files up to 10MB
                  </p>
                </div>
              </div>
            </label>
          </div>

          {uploadedFile && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                    <p className="text-sm text-blue-700">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={createNewBatch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start Analysis
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Step 1: Fraud Detection
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Step 2: Market Intelligence
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Step 3: Customer Search
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Batches</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchList;