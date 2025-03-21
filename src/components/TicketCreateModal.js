import React, { useState } from 'react';
import { createTicket } from './api';

const TicketCreateModal = ({ isOpen, onClose, onTicketCreated, userRole, userEmail, countryCode }) => {
  const [formData, setFormData] = useState({
    title: '',
    country: countryCode || '',
    level: 'Central',
    store: '',
    storeId: '',
    product: '',
    priority: 'Medium',
    description: '',
    rootCause: 'Procurement',
    creator: userEmail,
    assignedTo: userEmail,
    oversight: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.country || !formData.level || !formData.store || !formData.product) {
      setError("Please fill in all required fields.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newTicket = await createTicket(formData);
      onTicketCreated(newTicket);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Brief description of the issue"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Country name"
                required
                disabled={userRole === 'Country Office'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Central">Central</option>
                <option value="Subnational">Subnational</option>
                <option value="Local">Local</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="store"
                value={formData.store}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Store name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store ID
              </label>
              <input
                type="text"
                name="storeId"
                value={formData.storeId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Store ID (if known)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Vaccine/product type"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Root Cause Category
              </label>
              <select
                name="rootCause"
                value={formData.rootCause}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="Funding">Funding</option>
                <option value="Distribution">In Country Distribution</option>
                <option value="Procurement UNICEF">Procurement and Supply (UNICEF)</option>
                <option value="Storage">Storage capacity/functionality</option>
                <option value="Procurement EPI">Procurement and Supply (EPI)</option>
                <option value="Forecasting">Forecasting and allocation</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Detailed explanation of the issue"
              required
            ></textarea>
          </div>
          
          {/* Only show these fields for UNICEF, GAVI, or Administrator */}
          {(userRole === 'UNICEF' || userRole === 'GAVI' || userRole === 'Administrator') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <input
                  type="email"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Email of person responsible"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oversight
                </label>
                <input
                  type="email"
                  name="oversight"
                  value={formData.oversight}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Email of UNICEF/GAVI contact"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketCreateModal; 