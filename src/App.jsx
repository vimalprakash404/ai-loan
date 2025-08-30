import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppProvider from './context/AppContext';
import Layout from './components/layout/Layout';
import BatchList from './pages/BatchList';
import FraudDetection from './pages/FraudDetection';
import MarketIntelligence from './pages/MarketIntelligence';
import CustomerSearch from './pages/CustomerSearch';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<BatchList />} />
            <Route path="/batch/:batchId/fraud-detection" element={<FraudDetection />} />
            <Route path="/batch/:batchId/market-intelligence" element={<MarketIntelligence />} />
            <Route path="/batch/:batchId/customer-search" element={<CustomerSearch />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;