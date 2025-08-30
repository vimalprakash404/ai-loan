import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import { useAppContext } from '../../context/AppContext';
import { useBatch } from '../../hooks/useBatch';

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentStep } = useAppContext();
  const { selectedBatch } = useBatch();

  // Clone children and pass props to page components
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        selectedBatch,
        currentStep,
        ...child.props
      });
    }
    return child;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedBatch={selectedBatch} currentStep={currentStep} />
      <Navigation selectedBatch={selectedBatch} />
      
      <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {childrenWithProps}
      </main>
    </div>
  );
};

export default Layout;