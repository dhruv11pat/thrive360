import React, { useState } from 'react';
import { updateTicket, addComment } from './api';

const TicketDetailModal = ({ isOpen, onClose, ticket, onTicketUpdated, userRole, userEmail }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({...ticket});
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Check if user has edit permissions
  const canEdit = userRole === 'Administrator' || 
                 (userRole === 'UNICEF' && ticket.oversight?.includes('unicef')) ||
                 (userRole === 'GAVI' && ticket.oversight?.includes('gavi')) ||
                 (userRole === 'Country Office' && ticket.creator === userEmail);

  // Check if user can change status
  const canChangeStatus = userRole === 'Administrator' || 
                         userRole === 'UNICEF' || 
                         userRole === 'GAVI' ||
                         (userRole === 'Country Office' && 
                          ['Open', 'In Progress', 'Implementing', 'Verification'].includes(ticket.status));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateTicket = async () => {
    try {
      setIsSubmitting(true);
      const updatedTicket = await updateTicket(ticket.id, formData);
      onTicketUpdated(updatedTicket);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError("Failed to update ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      const comment = {
        user: userEmail,
        role: userRole,
        text: newComment
      };
      
      const addedComment = await addComment(ticket.id, comment);
      
      // Update the local ticket state with the new comment
      const updatedTicket = {
        ...ticket,
        comments: [...(ticket.comments || []), addedComment]
      };
      
      onTicketUpdated(updatedTicket);
      setNewComment('');
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsSubmitting(true);
      
      // Add automatic comment for status change
      const statusComment = {
        user: userEmail,
        role: userRole,
        text: `Changed status from ${ticket.status} to ${newStatus}`
      };
      
      const addedComment = await addComment(ticket.id, statusComment);
      
      // Update the status
      const updatedTicket = await updateTicket(ticket.id, { 
        status: newStatus,
        comments: [...(ticket.comments || []), addedComment]
      });
      
      onTicketUpdated(updatedTicket);
    } catch (err) {
      console.error("Error changing status:", err);
      setError("Failed to change status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status color based on ticket status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Implementing':
        return 'bg-purple-100 text-purple-800';
      case 'Verification':
        return 'bg-indigo-100 text-indigo-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color based on ticket priority
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {editMode ? 'Edit Ticket' : 'Ticket Details'} - {ticket.id}
          </h2>
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
        
        {/* Status and priority badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
            Status: {ticket.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
            Priority: {ticket.priority}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100">
            Created: {ticket.createdDate}
          </span>
        </div>
        
        {/* Status action buttons */}
        {canChangeStatus && !editMode && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Change Status</h3>
            <div className="flex flex-wrap gap-2">
              {ticket.status !== 'Open' && (
                <button
                  onClick={() => handleStatusChange('Open')}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-full"
                  disabled={isSubmitting}
                >
                  Set to Open
                </button>
              )}
              
              {ticket.status !== 'In Progress' && (
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded-full"
                  disabled={isSubmitting}
                >
                  Set to In Progress
                </button>
              )}
              
              {ticket.status !== 'Pending Approval' && (userRole === 'UNICEF' || userRole === 'GAVI' || userRole === 'Administrator') && (
                <button
                  onClick={() => handleStatusChange('Pending Approval')}
                  className="px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 rounded-full"
                  disabled={isSubmitting}
                >
                  Set to Pending Approval
                </button>
              )}
              
              {ticket.status !== 'Implementing' && (
                <button
                  onClick={() => handleStatusChange('Implementing')}
                  className="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 rounded-full"
                  disabled={isSubmitting}
                >
                  Set to Implementing
                </button>
              )}
              
              {ticket.status !== 'Verification' && (
                <button
                  onClick={() => handleStatusChange('Verification')}
                  className="px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 rounded-full"
                  disabled={isSubmitting}
                >
                  Set to Verification
                </button>
              )}
              
              {ticket.status !== 'Resolved' && (userRole === 'UNICEF' || userRole === 'GAVI' || userRole === 'Administrator') && (
                <button
                  onClick={() => handleStatusChange('Resolved')}
                  className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 rounded-full"
                  disabled={isSubmitting}
                >
                  Set to Resolved
                </button>
              )}
              
              {ticket.status !== 'Closed' && (userRole === 'UNICEF' || userRole === 'GAVI' || userRole === 'Administrator') && (
                <button
                  onClick={() => handleStatusChange('Closed')}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full"
                  disabled={isSubmitting}
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Ticket details */}
        {editMode ? (
          // Edit form
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Root Cause</label>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <input
                type="email"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows="4"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Steps</label>
              <textarea
                name="resolutionSteps"
                value={formData.resolutionSteps}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows="4"
              ></textarea>
            </div>
          </div>
        ) : (
          // View mode
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1">{ticket.title}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Country</h3>
              <p className="mt-1">{ticket.country}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Level</h3>
              <p className="mt-1">{ticket.level}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Store</h3>
              <p className="mt-1">{ticket.store}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Product</h3>
              <p className="mt-1">{ticket.product}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Root Cause Category</h3>
              <p className="mt-1">{ticket.rootCause}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="mt-1">{ticket.creator}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
              <p className="mt-1">{ticket.assignedTo || 'Not assigned'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 whitespace-pre-line">{ticket.description}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Resolution Steps</h3>
              <p className="mt-1 whitespace-pre-line">{ticket.resolutionSteps || 'No resolution steps yet'}</p>
            </div>
          </div>
        )}
        
        {/* Edit/Save buttons */}
        {canEdit && (
          <div className="flex justify-end mb-6">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTicket}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Edit Ticket
              </button>
            )}
          </div>
        )}
        
        {/* Comments section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Comments</h3>
          
          <div className="space-y-4 mb-4 max-h-64 overflow-y-auto p-2">
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">
                      {comment.user}
                      <span className="text-xs text-gray-500 ml-2">{comment.role}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No comments yet</p>
            )}
          </div>
          
          {/* Add comment */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
              rows="2"
              placeholder="Type your comment here..."
            ></textarea>
            <button
              onClick={handleAddComment}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded text-sm"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal; 