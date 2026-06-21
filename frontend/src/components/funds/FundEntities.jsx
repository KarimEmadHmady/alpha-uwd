'use client';

import React, { useState } from 'react';
import { useEntities } from '@/hooks/useEntities';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const FundEntities = ({ fundId }) => {
  const { token } = useAuth();
  const { entities, isLoading, addEntity, updateEntity, deleteEntity, error, successMessage, clearMessages } = useEntities(fundId, token);
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, entityId: null, entityName: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    imageent: null,
    entname: '',
    link: ''
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
      imageent: null,
      entname: '',
      link: ''
    });
    setEditingEntity(null);
    setShowAddForm(false);
  };

  // Add new entity
  const handleAddEntity = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('imageent', formData.imageent);
      formDataToSend.append('fund_id', fundId);
      formDataToSend.append('entname', formData.entname);
      formDataToSend.append('link', formData.link);

      const success = await addEntity(formDataToSend);
      if (success) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update entity
  const handleUpdateEntity = async (e) => {
    e.preventDefault();
    if (!editingEntity) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      if (formData.imageent) {
        formDataToSend.append('imageent', formData.imageent);
      }
      formDataToSend.append('fund_id', fundId);
      formDataToSend.append('entname', formData.entname);
      formDataToSend.append('link', formData.link);

      const success = await updateEntity(editingEntity.id, formDataToSend);
      if (success) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete entity
  const handleDeleteEntity = async (e, entityId, entityName) => {
    e.preventDefault();
    setDeleteConfirm({
      isOpen: true,
      entityId,
      entityName
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    await deleteEntity(deleteConfirm.entityId);
    setDeleteConfirm({ isOpen: false, entityId: null, entityName: '' });
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, entityId: null, entityName: '' });
  };

  // Start editing entity
  const startEditEntity = (entity) => {
    setEditingEntity(entity);
    setFormData({
      imageent: null,
      entname: entity.entname,
      link: entity.link || ''
    });
    setShowAddForm(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h3 className="text-lg font-semibold">Fund Entities</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#00437a] text-white rounded-lg hover:bg-[#003560] transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Entity'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-md font-medium mb-4">
            {editingEntity ? 'Edit Entity' : 'Add New Entity'}
          </h4>
          <form onSubmit={editingEntity ? handleUpdateEntity : handleAddEntity}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Entity Name</label>
                <input
                  type="text"
                  name="entname"
                  value={formData.entname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Entity Link</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="http://example.com/entity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {editingEntity ? 'Update Image (Optional)' : 'Entity Image'}
                </label>
                <input
                  type="file"
                  name="imageent"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                />
                {editingEntity && (
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
                {isSubmitting ? 'Saving...' : (editingEntity ? 'Update' : 'Add')}
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

      {/* Entities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00437a]"></div>
            <p className="mt-2 text-gray-600">Loading entities...</p>
          </div>
        ) : !Array.isArray(entities) || entities.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No entities found for this fund.
          </div>
        ) : (
          entities.map((entity) => (
            <div key={entity.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
              {/* Entity Image */}
              <div className="flex justify-center mb-4">
                {entity.imageent ? (
                  <img 
                    src={entity.imageent} 
                    alt={entity.entname}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Entity Info */}
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-3 line-clamp-2">{entity.entname}</h4>
                
                {entity.link && (
                  <a
                    href={entity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-3"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Visit Website
                  </a>
                )}
                
                {/* Creation Date */}
                {entity.created_at && (
                  <div className="text-xs text-gray-500 mb-4">
                    Created: {new Date(entity.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => startEditEntity(entity)}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteEntity(e, entity.id, entity.entname)}
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
        title="Delete Entity"
        message={`Are you sure you want to delete "${deleteConfirm.entityName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default FundEntities;
