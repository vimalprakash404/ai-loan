import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, MapPin, Search, FileText } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, isActive, onClick, disabled = false }) => (
  <button
    onClick={() => !disabled && onClick(id)}
    disabled={disabled}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
      disabled 
        ? 'text-gray-400 cursor-not-allowed'
        : isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
  >
    <Icon size={18} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const Navigation = ({ selectedBatch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!selectedBatch) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 py-3 overflow-x-auto">
          <TabButton
            id="batches"
            label="← Back to Batches"
            icon={FileText}
            isActive={location.pathname === '/'}
            onClick={() => handleNavigation('/')}
          />
          <TabButton
            id="fraud-detection"
            label="Step 1: Fraud Detection"
            icon={Shield}
            isActive={location.pathname === `/batch/${selectedBatch.id}/fraud-detection`}
            onClick={() => handleNavigation(`/batch/${selectedBatch.id}/fraud-detection`)}
          />
          <TabButton
            id="market-intelligence"
            label="Step 2: Market Intel"
            icon={MapPin}
            isActive={location.pathname === `/batch/${selectedBatch.id}/market-intelligence`}
            onClick={() => handleNavigation(`/batch/${selectedBatch.id}/market-intelligence`)}
          />
          <TabButton
            id="customer-search"
            label="Step 3: Customer Search"
            icon={Search}
            isActive={location.pathname === `/batch/${selectedBatch.id}/customer-search`}
            onClick={() => handleNavigation(`/batch/${selectedBatch.id}/customer-search`)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;