'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const FundDocuments = ({ fundId }) => {
  const { token } = useAuth();
  const { documents, isLoading, addDocument, updateDocument, deleteDocument, error, successMessage, clearMessages } = useDocuments(fundId, token);
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, documentId: null, documentName: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    file: null,
    document: ''
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
      file: null,
      document: ''
    });
    setEditingDocument(null);
    setShowAddForm(false);
  };

  // Add new document
  const handleAddDocument = async (e) => {
    e.preventDefault();
    console.log('=== ADD DOCUMENT START ===');
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file);
      formDataToSend.append('fund_id', fundId);
      formDataToSend.append('document', formData.document);

      console.log('Submitting document:', {
        file: formData.file,
        fundId: fundId,
        document: formData.document
      });

      console.log('Calling addDocument...');
      const success = await addDocument(formDataToSend);
      console.log('addDocument returned:', success);
      
      if (success) {
        console.log('Document added successfully, resetting form');
        resetForm();
      }
    } catch (error) {
      console.error('Error in handleAddDocument:', error);
    } finally {
      setIsSubmitting(false);
      console.log('=== ADD DOCUMENT END ===');
    }
  };

  // Update document
  const handleUpdateDocument = async (e) => {
    e.preventDefault();
    if (!editingDocument) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      formDataToSend.append('fund_id', fundId);
      formDataToSend.append('document', formData.document);

      const success = await updateDocument(editingDocument.id, formDataToSend);
      if (success) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (e, documentId, documentName) => {
    e.preventDefault();
    setDeleteConfirm({
      isOpen: true,
      documentId,
      documentName
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    await deleteDocument(deleteConfirm.documentId);
    setDeleteConfirm({ isOpen: false, documentId: null, documentName: '' });
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, documentId: null, documentName: '' });
  };

  // Start editing document
  const startEditDocument = (document) => {
    setEditingDocument(document);
    setFormData({
      file: null,
      document: document.document
    });
    setShowAddForm(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h3 className="text-lg font-semibold">Fund Documents</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#00437a] text-white rounded-lg hover:bg-[#003560] transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Document'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-md font-medium mb-4">
            {editingDocument ? 'Edit Document' : 'Add New Document'}
          </h4>
          <form onSubmit={editingDocument ? handleUpdateDocument : handleAddDocument}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document Name</label>
                <input
                  type="text"
                  name="document"
                  value={formData.document}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                />
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {editingDocument ? 'Update File (Optional)' : 'Document File'}
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
                />
                {editingDocument && (
                  <p className="text-sm text-gray-600 mt-1">
                    Leave empty to keep current file
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
                {isSubmitting ? 'Saving...' : (editingDocument ? 'Update' : 'Add')}
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

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00437a]"></div>
            <p className="mt-2 text-gray-600">Loading documents...</p>
          </div>
        ) : !Array.isArray(documents) || documents.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No documents found for this fund.
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
              {/* PDF Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Document Info */}
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-3 line-clamp-2">{doc.document}</h4>
                
                {doc.linkdoc && (
                  <a
                    href={doc.linkdoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-3"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    View Document
                  </a>
                )}
                
                {doc.file_path && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                    </svg>
                    <span>PDF Document</span>
                  </div>
                )}
                
                {/* File Size */}
                {doc.file_size && (
                  <div className="text-xs text-gray-500 mb-4">
                    {(doc.file_size / 1024).toFixed(1)} KB
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => startEditDocument(doc)}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteDocument(e, doc.id, doc.document)}
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
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteConfirm.documentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default FundDocuments;
