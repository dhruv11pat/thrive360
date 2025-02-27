// src/components/StockOutTable.js

import React, { useState, useEffect, useRef } from 'react';
// Remove the local data import
// import data from './data.json'; // Import the JSON data
import { fetchCountryData, fetchStoreData } from './api';
import LoginModal from './LoginModal';

const StockOutTable = () => {
  // Check for existing authentication in localStorage
  const checkExistingAuth = () => {
    const storedAuth = localStorage.getItem('stockOutDashboardAuth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        // Check if the authentication is still valid (within 30 days)
        if (authData.expiry > Date.now()) {
          return true;
        } else {
          // Clear expired authentication
          localStorage.removeItem('stockOutDashboardAuth');
        }
      } catch (e) {
        // If there's an error parsing, clear the invalid data
        localStorage.removeItem('stockOutDashboardAuth');
      }
    }
    return false;
  };

  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(checkExistingAuth());
  const [showLoginModal, setShowLoginModal] = useState(!checkExistingAuth());
  
  // Add new state for search
  const [searchTerm, setSearchTerm] = useState('');
  // Add state for API data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update filter states to use risk category with 'above80' as default
  const [filters, setFilters] = useState({
    Central: { store: '', riskCategory: 'above80' },
    Subnational: { store: '', riskCategory: 'above80' },
    Local: { store: '', riskCategory: 'above80' }
  });

  // Fetch country data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const countryData = await fetchCountryData();
        setData(countryData);
      } catch (err) {
        console.error("Error loading country data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Group data by level and categorize - moved inside useEffect to depend on data
  const [groupedData, setGroupedData] = useState({});
  
  useEffect(() => {
    if (data.length > 0) {
      const grouped = data.reduce((acc, item) => {
        const levelCode = item.unique_id.split('-')[1]; // Extract level from unique_id
        const level = levelCode === 'Ce' ? 'Central' : levelCode === 'Su' ? 'Subnational' : 'Local';
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push(item);
        return acc;
      }, {});
      setGroupedData(grouped);
    }
  }, [data]);

  // State to track expanded levels
  const [expandedLevels, setExpandedLevels] = useState({});
  const [storeData, setStoreData] = useState({});
  const fetchedStoreIds = useRef(new Set());
  const [loadingStores, setLoadingStores] = useState({});

  // Fetch store data from API
  useEffect(() => {
    if (Object.keys(groupedData).length === 0) return;
    
    const loadStoreData = async (storeId) => {
      if (loadingStores[storeId]) return; // Skip if already loading
      
      try {
        setLoadingStores(prev => ({ ...prev, [storeId]: true }));
        const storeInfo = await fetchStoreData(storeId);
        setStoreData((prev) => ({ ...prev, [storeId]: storeInfo }));
      } catch (error) {
        console.error(`Error fetching store data for store ${storeId}:`, error);
        setStoreData((prev) => ({ ...prev, [storeId]: null }));
      } finally {
        setLoadingStores(prev => ({ ...prev, [storeId]: false }));
      }
    };
    
    // Only fetch data for visible stores when a level is expanded
    Object.entries(expandedLevels).forEach(([level, isExpanded]) => {
      if (isExpanded && groupedData[level]) {
        groupedData[level].forEach((item) => {
          const storeId = item.unique_id.split('-').slice(0, 3).join('-');
          if (!fetchedStoreIds.current.has(storeId)) {
            fetchedStoreIds.current.add(storeId);
            loadStoreData(storeId);
          }
        });
      }
    });
  }, [groupedData, expandedLevels, loadingStores]);

  // Toggle function for expanding/collapsing levels
  const toggleLevel = (level) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  // Define color classes for each level
  const colorClasses = {
    Central: {
      header: 'bg-indigo-200',
      row: 'bg-indigo-100',
      expandedHeader: 'bg-indigo-300',
      expandedRow: 'bg-indigo-50',
    },
    Subnational: {
      header: 'bg-teal-200',
      row: 'bg-teal-100',
      expandedHeader: 'bg-teal-300',
      expandedRow: 'bg-teal-50',
    },
    Local: {
      header: 'bg-yellow-200',
      row: 'bg-yellow-100',
      expandedHeader: 'bg-yellow-300',
      expandedRow: 'bg-yellow-50',
    },
  };

  // Order levels
  const orderedLevels = ['Central', 'Subnational', 'Local'];

  // Add search handler
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Add filter handlers
  const handleStoreFilterChange = (level, value) => {
    setFilters(prev => ({
      ...prev,
      [level]: { ...prev[level], store: value }
    }));
  };

  const handleRiskCategoryChange = (level, category) => {
    setFilters(prev => ({
      ...prev,
      [level]: { ...prev[level], riskCategory: category }
    }));
  };

  // Filter data based on filters
  const getFilteredData = (level) => {
    if (!groupedData[level]) return [];
    
    return groupedData[level].filter(item => {
      // Filter by store name
      const storeMatch = item.store_name.toLowerCase().includes(filters[level].store.toLowerCase());
      
      // Filter by risk category
      const riskValue = item.probability * 100;
      let riskMatch = true;
      
      switch(filters[level].riskCategory) {
        case 'below50':
          riskMatch = riskValue < 50;
          break;
        case '50to80':
          riskMatch = riskValue >= 50 && riskValue <= 80;
          break;
        case 'above80':
          riskMatch = riskValue > 80;
          break;
        case 'all':
        default:
          riskMatch = true;
          break;
      }
      
      return storeMatch && riskMatch;
    });
  };

  // Handle successful login
  const handleLogin = (success) => {
    if (success) {
      // Set authentication state
      setIsAuthenticated(true);
      setShowLoginModal(false);
      
      // Store authentication in localStorage with 30-day expiry
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const authData = {
        authenticated: true,
        timestamp: Date.now(),
        expiry: Date.now() + thirtyDaysInMs
      };
      localStorage.setItem('stockOutDashboardAuth', JSON.stringify(authData));
    }
  };

  // Add logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLoginModal(true);
    localStorage.removeItem('stockOutDashboardAuth');
  };

  return (
    <div className="container mx-auto">
      {/* Show login modal if not authenticated */}
      <LoginModal 
        isOpen={showLoginModal && !isAuthenticated} 
        onLogin={handleLogin} 
      />
      
      {/* Only show the dashboard content if authenticated */}
      {isAuthenticated && (
        <>
          {/* Loading and error states */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* TopBar with logout button */}
              <div className="bg-white shadow-md p-4 mb-6 flex justify-between items-center">
                <div className="text-xl font-bold">Stock-Out Dashboard</div>
                
                {/* Add logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>

              {/* Existing content */}
              <div className="p-4">
                {orderedLevels.map((level) => (
                  groupedData[level] && (
                    <div key={level} className="mb-8">
                      <h2 className="text-xl font-semibold mb-2">Level: {level}</h2>
                      <p className="mb-4">This table shows the stock-out situations for level {level}.</p>
                      
                      {/* Updated filter section with buttons */}
                      <div className="bg-gray-100 p-4 mb-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Store Name
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              placeholder="Filter by store name..."
                              value={filters[level].store}
                              onChange={(e) => handleStoreFilterChange(level, e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Stock-out Risk
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <button
                                className={`px-3 py-1 rounded-md ${
                                  filters[level].riskCategory === 'below50' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                                onClick={() => handleRiskCategoryChange(level, 'below50')}
                              >
                                Below 50%
                              </button>
                              <button
                                className={`px-3 py-1 rounded-md ${
                                  filters[level].riskCategory === '50to80' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                                onClick={() => handleRiskCategoryChange(level, '50to80')}
                              >
                                50% - 80%
                              </button>
                              <button
                                className={`px-3 py-1 rounded-md ${
                                  filters[level].riskCategory === 'above80' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                                onClick={() => handleRiskCategoryChange(level, 'above80')}
                              >
                                Above 80%
                              </button>
                              <button
                                className={`px-3 py-1 rounded-md ${
                                  filters[level].riskCategory === 'all' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                                onClick={() => handleRiskCategoryChange(level, 'all')}
                              >
                                Show All
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className={colorClasses[level]?.header || 'bg-gray-200'}>
                              <th className="px-6 py-3 border border-gray-300">Level</th>
                              <th className="px-6 py-3 border border-gray-300">Number of Unique IDs</th>
                              <th className="px-6 py-3 border border-gray-300">Number of Stores</th>
                              <th className="px-6 py-3 border border-gray-300">Number of Vaccines</th>
                              <th className="px-6 py-3 border border-gray-300">Action</th>
                              <th className="px-6 py-3 border border-gray-300">Description</th>
                              <th className="px-6 py-3 border border-gray-300">Comments</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              className={`${colorClasses[level]?.row || 'bg-gray-100'} cursor-pointer`}
                              onClick={() => toggleLevel(level)}
                            >
                              <td className="px-6 py-4 border border-gray-300">{level}</td>
                              <td className="px-6 py-4 border border-gray-300">{getFilteredData(level).length}</td>
                              <td className="px-6 py-4 border border-gray-300">{new Set(getFilteredData(level).map(item => item.store_name)).size}</td>
                              <td className="px-6 py-4 border border-gray-300">{new Set(getFilteredData(level).map(item => item.vaccine_type)).size}</td>
                              <td className="px-6 py-4 border border-gray-300">{expandedLevels[level] ? 'Collapse' : 'Expand'}</td>
                              <td className="py-2 px-6 border border-gray-300 flex flex-col">
                                <button className="bg-gray-500 text-white text-xs px-2 py-1 mb-2 rounded" data-tooltip-target="tooltip-funding">Funding</button>
                                <button className="bg-gray-500 text-white text-xs px-2 py-1 mb-2 rounded" data-tooltip-target="tooltip-in-country-distribution">In Country Distribution</button>
                                <button className="bg-gray-500 text-white text-xs px-2 py-1 mb-2 rounded" data-tooltip-target="tooltip-procurement-and-supply-unicef">Procurement and Supply (UNICEF)</button>
                                <button className="bg-gray-500 text-white text-xs px-2 py-1 mb-2 rounded" data-tooltip-target="tooltip-storage-capacity-functionality">Storage capacity/functionality</button>
                                <button className="bg-gray-500 text-white text-xs px-2 py-1 mb-2 rounded" data-tooltip-target="tooltip-procurement-and-supply-epi">Procurement and Supply (EPI)</button>
                                <button className="bg-gray-500 text-white text-xs px-2 py-1 mb-2 rounded" data-tooltip-target="tooltip-forecasting-and-allocation">Forecasting and allocation</button>
                              </td>
                              <td className="px-6 py-4 border border-gray-300">Comments here</td>
                            </tr>
                            {expandedLevels[level] && (
                              <>
                                <tr className={colorClasses[level]?.expandedHeader || 'bg-gray-300'}>
                                  <th className="px-6 py-3 border border-gray-300">Country</th>
                                  <th className="px-6 py-3 border border-gray-300">Store</th>
                                  <th className="px-6 py-3 border border-gray-300">Parent Store</th>
                                  <th className="px-6 py-3 border border-gray-300">Vaccine Type</th>
                                  <th className="px-6 py-3 border border-gray-300">3M Stockout Risk*</th>
                                  <th className="px-6 py-3 border border-gray-300">Curent Stataus(Min/Max)</th>
                                  <th className="px-6 py-3 border border-gray-300">Report Date</th>
                                </tr>
                                {getFilteredData(level).map((item, index) => {
                                  const storeId = item.unique_id.split('-').slice(0, 3).join('-');
                                  const storeInfo = storeData[storeId];
                                  const storeDataRecord = Array.isArray(storeInfo) ? storeInfo[0] : storeInfo;
                                  const vaccineType = item.vaccine_type.toLowerCase();
                                  
                                  // Get parent store data
                                  console.log('Store Data Record', storeDataRecord);
                                  const parentStoreId = storeDataRecord?.parentstore;
                                  const parentStoreInfo = parentStoreId ? storeData[parentStoreId] : null;
                                  const parentStoreRecord = Array.isArray(parentStoreInfo) ? parentStoreInfo[0] : parentStoreInfo;
                                  const parentVaccineStock = parentStoreRecord?.[vaccineType];
                                 

                                  let progressBarContent = 'Loading...';
                                  if (storeDataRecord === null && level !== 'Central') {
                                    progressBarContent = 'No Data';
                                  } else if (
                                    storeDataRecord !== undefined &&
                                    level !== 'Central' &&
                                    storeDataRecord.hasOwnProperty(vaccineType) &&
                                    storeDataRecord.hasOwnProperty(`${vaccineType}_min`) &&
                                    storeDataRecord.hasOwnProperty(`${vaccineType}_max`)
                                  ) {
                                    const actual = storeDataRecord[vaccineType];
                                    const min = storeDataRecord[`${vaccineType}_min`];
                                    const max = storeDataRecord[`${vaccineType}_max`];

                                    if (actual < min) {
                                      const progress = ((actual - min) / (max - min)) * 100;
                                      const barWidth = Math.min(Math.abs(progress), 100);
                                      progressBarContent = (
                                        <div className="flex flex-col">
                                          <span className="text-sm font-bold text-center">Available Stock: {actual}</span>
                                          <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
                                          
                                            <div
                                              className="absolute top-0 left-0 h-4 bg-red-500 rounded"
                                              style={{ width: `${barWidth}%` }}
                                            ></div>
                                           
                                            <span className="absolute inset-0 flex items-center justify-center text-xs text-black">
                                              {progress.toFixed(0)}%
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-xs mt-1">
                                            <span>Min: {min}</span>
                                            
                                            <span>Max: {max}</span>
                                          </div>
                                        </div>
                                      );
                                    } else {
                                      // Calculate progress percentage (can be >100)
                                      const progress = max !== min ? ((actual - min) / (max - min)) * 100 : 0;
                                      const barWidth = Math.min(progress, 100);
                                      progressBarContent = (
                                        <div className="flex flex-col">
                                          <span className="text-sm font-bold text-center">Avalible Stock: {actual}</span>
                                          <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
                                            <div
                                              className="absolute top-0 left-0 h-4 bg-green-500 rounded"
                                              style={{ width: `${barWidth}%` }}
                                            ></div>
                                            <span className="absolute inset-0 flex items-center justify-center text-xs text-black">
                                              {progress.toFixed(0)}%
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-xs mt-1">
                                            <span>Min: {min}</span>
                                          
                                            <span>Max: {max}</span>
                                          </div>
                                        </div>
                                      );
                                    }
                                   
                                  } else if (storeDataRecord !== undefined && level !== 'Central') {
                                    progressBarContent = 'No Data';
                                  } else {
                                    progressBarContent = item.stockout_risk;
                                  }
                                

                                  return (
                                    <tr key={index} className={colorClasses[level]?.expandedRow || 'bg-gray-50'}>
                                      <td className="px-6 py-4 border border-gray-300">{item.country_name}</td>
                                      <td className="px-6 py-4 border border-gray-300">
                                        <div className="flex flex-col">
                                          <span className="font-normal">{item.store_name}</span>
                                          <span className="text-xs text-gray-600">{item.unique_id}</span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 border border-gray-300">
                                        <div className="flex flex-col">
                                        
                                          <span className=" text-sm font-bold">{parentStoreRecord?.adminlevel1}</span>
                                          
                                          <span className="text-xs">{storeDataRecord?.parentstore || 'No Parent Store'}</span>
                                          {parentVaccineStock !== undefined && (
                                            <span className="text-xs text-gray-600 font-bold">Parent Stock: {parentVaccineStock}</span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 border border-gray-300">{item.vaccine_type}</td>
                                      <td className="px-6 py-4 border border-gray-300">{(item.probability * 100).toFixed(0)}%</td>
                                      <td className="px-6 py-4 border border-gray-300">
                                        {progressBarContent}
                                      </td>
                                      
                                      <td className="px-6 py-4 border border-gray-300">
                                        {new Date(item.report_date).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StockOutTable;
