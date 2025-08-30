import React from 'react';
import { Upload, Plus, FileText } from 'lucide-react';

const FileUpload = ({ uploadedFile, onFileUpload, onCreateBatch }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Batch Processing</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your fraud detection batches</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={onFileUpload}
              className="hidden"
              id="batch-upload"
            />
            <label
              htmlFor="batch-upload"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Upload size={16} />
              Upload CSV
            </label>
          </div>
          
          {uploadedFile && (
            <button
              onClick={onCreateBatch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Create Batch
            </button>
          )}
        </div>
      </div>

      {uploadedFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">{uploadedFile.name}</p>
              <p className="text-sm text-blue-700">{(uploadedFile.size / 1024).toFixed(1)} KB • Ready to create batch</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;