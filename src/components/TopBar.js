import React from 'react';

const TopBar = ({ activeTab, setActiveTab, userRole, handleLogout, countryCode }) => {
  return (
    <div className="bg-white shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-700">THRIVE360 Suite</div>
          <span className="mx-2 text-gray-400">|</span>
          <p className="text-sm text-gray-600 hidden md:block">Comprehensive tools for vaccine supply chain management</p>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-sm font-medium text-gray-600">
            Logged in as: <span className="text-blue-600">{userRole} {countryCode}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Tab navigation with categories */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          {/* Analytics & Data Category */}
          <div className="mr-4 mb-2 px-3 pt-2 pb-1 bg-blue-50 rounded-t-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-blue-700 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <div className="text-xs font-semibold text-blue-700 uppercase">Analytics & Data</div>
            </div>
            <div className="flex space-x-1">
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'powerbi'
                    ? 'font-medium text-blue-700 border-b-2 border-blue-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-blue-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('powerbi')}
              >
                Analytics
              </button>
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'warehouse'
                    ? 'font-medium text-blue-700 border-b-2 border-blue-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-blue-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('warehouse')}
              >
                Data Warehouse
              </button>
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'ai'
                    ? 'font-medium text-blue-700 border-b-2 border-blue-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-blue-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('ai')}
              >
                AI Models
              </button>
            </div>
          </div>
          
          {/* Operations Category */}
          <div className="mr-4 mb-2 px-3 pt-2 pb-1 bg-purple-50 rounded-t-lg border border-purple-100">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-purple-700 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <div className="text-xs font-semibold text-purple-700 uppercase">Operations</div>
            </div>
            <div className="flex space-x-1">
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'dashboard'
                    ? 'font-medium text-purple-700 border-b-2 border-purple-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-purple-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                Tracker
              </button>
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'tickets'
                    ? 'font-medium text-purple-700 border-b-2 border-purple-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-purple-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('tickets')}
              >
                Tickets
              </button>
            </div>
          </div>
          
          {/* Forecasting Category */}
          <div className="mr-4 mb-2 px-3 pt-2 pb-1 bg-orange-50 rounded-t-lg border border-orange-100">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-orange-700 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
              <div className="text-xs font-semibold text-orange-700 uppercase">Forecasting</div>
            </div>
            <div className="flex space-x-1">
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'forecasting'
                    ? 'font-medium text-orange-700 border-b-2 border-orange-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-orange-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('forecasting')}
              >
                Forecasting Planning
              </button>
            </div>
          </div>
          
          {/* Sustainability Category */}
          <div className="mb-2 px-3 pt-2 pb-1 bg-green-50 rounded-t-lg border border-green-100">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-green-700 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div className="text-xs font-semibold text-green-700 uppercase">Sustainability</div>
            </div>
            <div className="flex space-x-1">
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'solar'
                    ? 'font-medium text-green-700 border-b-2 border-green-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-green-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('solar')}
              >
                Solar Electrification
              </button>
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'waste'
                    ? 'font-medium text-green-700 border-b-2 border-green-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-green-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('waste')}
              >
                Waste Management
              </button>
              <button
                className={`py-2 px-3 text-sm rounded-t-lg ${
                  activeTab === 'carbon'
                    ? 'font-medium text-green-700 border-b-2 border-green-500 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-green-500 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('carbon')}
              >
                Carbon Footprint
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 