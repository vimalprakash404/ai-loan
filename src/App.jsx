import React, { useState } from 'react';
import { Upload, Play, Calculator, Users, DollarSign, Car, CreditCard, AlertCircle, CheckCircle, Eye, EyeOff, Download, RotateCcw } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('login');
  const [user, setUser] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [purchasePowerResults, setPurchasePowerResults] = useState([]);
  const [loanResults, setLoanResults] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // Mock login function
  const handleLogin = () => {
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    // Simple validation - in real app, this would call backend
    if (email && password) {
      setUser({ email, name: email.split('@')[0] });
      setCurrentStep('upload');
    }
  };

  // Parse Excel-like data (mocked)
  const processUploadedFile = (file) => {
    // In real app, would use SheetJS to parse Excel
    // For demo, creating mock data
    const mockData = [
      { id: 1, age: 25, salary: 50000, experience: 2 },
      { id: 2, age: 35, salary: 75000, experience: 10 },
      { id: 3, age: 45, salary: 90000, experience: 20 },
      { id: 4, age: 28, salary: 60000, experience: 5 },
      { id: 5, age: 55, salary: 120000, experience: 25 },
      { id: 6, age: 15, salary: -10000, experience: -2 }, // Invalid data for demo
    ];

    const validData = [];
    const validationErrors = [];

    mockData.forEach((row, index) => {
      const rowErrors = [];
      
      if (row.age < 18 || row.age > 65) {
        rowErrors.push(`Row ${index + 1}: Age must be between 18-65`);
      }
      if (row.salary < 0) {
        rowErrors.push(`Row ${index + 1}: Salary must be positive`);
      }
      if (row.experience < 0) {
        rowErrors.push(`Row ${index + 1}: Experience must be non-negative`);
      }

      if (rowErrors.length === 0) {
        validData.push(row);
      } else {
        validationErrors.push(...rowErrors);
      }
    });

    setUploadedData(validData);
    setErrors(validationErrors);
    setCurrentStep('display-data');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const calculatePurchasePower = () => {
    const results = uploadedData.map(person => {
      // Mock calculation: Purchase power based on salary and experience
      const baseAffordability = person.salary * 0.3; // 30% of annual salary
      const experienceBonus = person.experience * 1000;
      const ageAdjustment = person.age < 30 ? 0.9 : person.age > 50 ? 0.8 : 1.0;
      
      const maxCarPrice = (baseAffordability + experienceBonus) * ageAdjustment;
      
      let carCategory = '';
      if (maxCarPrice < 20000) carCategory = 'Budget';
      else if (maxCarPrice < 50000) carCategory = 'Mid-range';
      else carCategory = 'Premium';

      return {
        ...person,
        maxCarPrice: Math.round(maxCarPrice),
        carCategory,
        monthlyBudget: Math.round(maxCarPrice / 60) // 5-year loan
      };
    });

    setPurchasePowerResults(results);
    setCurrentStep('purchase-power');
  };

  const calculateLoanEligibility = () => {
    const results = purchasePowerResults.map(person => {
      // Mock loan calculation
      const debtToIncomeRatio = 0.4; // 40% max
      const maxLoanAmount = person.salary * debtToIncomeRatio * 5; // 5x annual eligible income
      const interestRate = person.experience > 10 ? 7.5 : person.experience > 5 ? 8.5 : 9.5;
      const loanTerm = person.age < 35 ? 7 : person.age < 50 ? 5 : 3; // years
      
      const monthlyPayment = (maxLoanAmount * (interestRate / 100 / 12)) / 
                            (1 - Math.pow(1 + (interestRate / 100 / 12), -loanTerm * 12));

      return {
        ...person,
        maxLoanAmount: Math.round(maxLoanAmount),
        interestRate,
        loanTerm,
        monthlyPayment: Math.round(monthlyPayment),
        loanStatus: maxLoanAmount >= person.maxCarPrice * 0.8 ? 'Approved' : 'Conditional'
      };
    });

    setLoanResults(results);
    setCurrentStep('loan-results');
  };

  const logout = () => {
    setUser(null);
    setCurrentStep('login');
    setUploadedData([]);
    setErrors([]);
    setPurchasePowerResults([]);
    setLoanResults([]);
  };

  const startAgain = () => {
    setCurrentStep('upload');
    setUploadedData([]);
    setErrors([]);
    setPurchasePowerResults([]);
    setLoanResults([]);
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    // Convert data to CSV format
    const headers = Object.keys(data[0]).join(',');
    const csvContent = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? "${value}" : value
      ).join(',')
    ).join('\n');
    
    const csv = headers + '\n' + csvContent;
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllResults = () => {
    if (loanResults.length === 0) return;
    
    // Prepare comprehensive data for export
    const exportData = loanResults.map(result => ({
      PersonID: result.id,
      Age: result.age,
      Salary: result.salary,
      Experience: result.experience,
      MaxCarPrice: result.maxCarPrice,
      CarCategory: result.carCategory,
      MonthlyBudget: result.monthlyBudget,
      MaxLoanAmount: result.maxLoanAmount,
      InterestRate: result.interestRate,
      LoanTerm: result.loanTerm,
      MonthlyPayment: result.monthlyPayment,
      LoanStatus: result.loanStatus
    }));
    
    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `financial-analysis-results-${timestamp}.csv`);
  };

  const exportPurchasePower = () => {
    if (purchasePowerResults.length === 0) return;
    
    const exportData = purchasePowerResults.map(result => ({
      PersonID: result.id,
      Age: result.age,
      Salary: result.salary,
      Experience: result.experience,
      MaxCarPrice: result.maxCarPrice,
      CarCategory: result.carCategory,
      MonthlyBudget: result.monthlyBudget
    }));
    
    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `purchase-power-analysis-${timestamp}.csv`);
  };

  // Login Component
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Analysis Portal</h1>
            <p className="text-gray-600">Sign in to analyze financial data</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <CreditCard className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">Financial Analysis</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              {currentStep !== 'upload' && (
                <button
                  onClick={startAgain}
                  className="text-green-600 hover:text-green-800 font-medium inline-flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Start Again
                </button>
              )}
              <button
                onClick={logout}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {['upload', 'display-data', 'purchase-power', 'loan-results'].map((step, index) => {
              const stepNames = ['Upload Data', 'Validate Data', 'Purchase Power', 'Loan Analysis'];
              const isActive = currentStep === step;
              const isCompleted = ['upload', 'display-data', 'purchase-power', 'loan-results'].indexOf(currentStep) > index;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive ? 'bg-indigo-600 text-white' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`ml-4 text-ml-2 text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {stepNames[index]}
                  </span>
                  {index < 3 && <div className="w-12 h-0.5 bg-gray-300 ml-4" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload Step */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <Upload className="mx-auto w-16 h-16 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Excel File</h2>
              <p className="text-gray-600 mb-6">
                Upload an Excel file with columns: Age, Salary, Experience
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-900">Click to upload</span>
                  <span className="text-gray-500">or drag and drop your Excel file here</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Display Data Step */}
        {currentStep === 'display-data' && (
          <div className="space-y-6">
            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-medium text-red-800">Validation Errors</h3>
                </div>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Valid Data */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Uploaded Data</h2>
                  <span className="text-sm text-gray-500">{uploadedData.length} valid records</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {uploadedData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{row.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.age}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">${row.salary.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.experience} years</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={calculatePurchasePower}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium inline-flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Calculate Purchase Power
                </button>
                
                <button
                  onClick={() => exportToCSV(uploadedData.map(d => ({
                    PersonID: d.id,
                    Age: d.age,
                    Salary: d.salary,
                    Experience: d.experience
                  })), `uploaded-data-${new Date().toISOString().split('T')[0]}.csv`        )}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium inline-flex items-center text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Power Results */}
        {currentStep === 'purchase-power' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Car className="w-6 h-6 mr-2 text-indigo-600" />
                  Car Purchase Power Analysis
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Car Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {purchasePowerResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">Person {result.id}</div>
                          <div className="text-sm text-gray-500">{result.age}y, {result.experience}y exp</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          ${result.maxCarPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.carCategory === 'Premium' ? 'bg-purple-100 text-purple-800' :
                            result.carCategory === 'Mid-range' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {result.carCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${result.monthlyBudget.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 text-center">
                <button
                  onClick={calculateLoanEligibility}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium inline-flex items-center"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Loan Eligibility
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loan Results */}
        {currentStep === 'loan-results' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                    <p className="text-2xl font-bold text-gray-900">{loanResults.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loanResults.filter(r => r.loanStatus === 'Approved').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Loan Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${loanResults.reduce((sum, r) => sum + r.maxLoanAmount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-indigo-600" />
                  Loan Eligibility Results
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Loan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loanResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">Person {result.id}</div>
                          <div className="text-sm text-gray-500">Salary: ${result.salary.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                          ${result.maxLoanAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {result.interestRate}%
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {result.loanTerm} years
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${result.monthlyPayment.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.loanStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.loanStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;