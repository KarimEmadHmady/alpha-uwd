'use client';

import React, { useState } from 'react';
import { useFundManagers } from '@/hooks/useFundManagers';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const FundManagers = ({ fundId }) => {
  const { token } = useAuth();
  const { fundManagers, isLoading, addFundManager, updateFundManager, deleteFundManager, error, successMessage, clearMessages } = useFundManagers(fundId, token);
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, managerId: null, managerName: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    name_arabic: ''
  });

  // Show toast notifications when messages change
  React.useEffect(() => {
    if (successMessage) {
      showSuccess(successMessage);
      clearMessages();
    }
    if (error) {
      showError(error);
      clearMessages();
    }
  }, [successMessage, error, showSuccess, showError, clearMessages]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      image: null,
      name: '',
      name_arabic: ''
    });
    setEditingManager(null);
    setShowAddForm(false);
  };

  // Add new fund manager
  const handleAddManager = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', formData.image);
      formDataToSend.append('fund_id', fundId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('name_arabic', formData.name_arabic);

      const success = await addFundManager(formDataToSend);
      if (success) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update fund manager
  const handleUpdateManager = async (e) => {
    e.preventDefault();
    if (!editingManager) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      formDataToSend.append('fund_id', fundId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('name_arabic', formData.name_arabic);

      const success = await updateFundManager(editingManager.id, formDataToSend);
      if (success) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete fund manager
  const handleDeleteManager = async (e, managerId, managerName) => {
    e.preventDefault();
    setDeleteConfirm({
      isOpen: true,
      managerId,
      managerName
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    await deleteFundManager(deleteConfirm.managerId);
    setDeleteConfirm({ isOpen: false, managerId: null, managerName: '' });
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, managerId: null, managerName: '' });
  };

  // Start editing fund manager
  const startEditManager = (manager) => {
    setEditingManager(manager);
    setFormData({
      image: null,
      name: manager.name,
      name_arabic: manager.name_arabic || ''
    });
    setShowAddForm(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h3 className="text-lg font-semibold">Fund Managers</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#00437a] text-white rounded-lg hover:bg-[#003560] transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Manager'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-md font-medium mb-4">
            {editingManager ? 'Edit Fund Manager' : 'Add New Fund Manager'}
          </h4>
          <form onSubmit={editingManager ? handleUpdateManager : handleAddManager}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Manager Name (English)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Manager Name (Arabic)</label>
                <input
                  type="text"
                  name="name_arabic"
                  value={formData.name_arabic}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                  placeholder="اسم المدير"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  {editingManager ? 'Update Image (Optional)' : 'Manager Image'}
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                />
                {editingManager && (
                  <p className="text-sm text-gray-600 mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#00437a] text-white rounded-lg hover:bg-[#003560] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (editingManager ? 'Update' : 'Add')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fund Managers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00437a]"></div>
            <p className="mt-2 text-gray-600">Loading fund managers...</p>
          </div>
        ) : !Array.isArray(fundManagers) || fundManagers.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No fund managers found for this fund.
          </div>
        ) : (
          fundManagers.map((manager) => (
            <div key={manager.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
              {/* Manager Image */}
              <div className="flex justify-center mb-4">
                {manager.image ? (
                  <img 
                    src={manager.image.startsWith('http') ? manager.image : `${process.env.NEXT_PUBLIC_API_URL}/${manager.image}`}
                    alt={manager.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Manager Info */}
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2">{manager.name}</h4>
                {manager.name_arabic && (
                  <p className="text-gray-600 text-sm mb-3">{manager.name_arabic}</p>
                )}
                
                {/* Creation Date */}
                {manager.created_at && (
                  <div className="text-xs text-gray-500 mb-4">
                    Added: {new Date(manager.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => startEditManager(manager)}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteManager(e, manager.id, manager.name)}
                  className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Fund Manager"
        message={`Are you sure you want to delete "${deleteConfirm.managerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default FundManagers;
