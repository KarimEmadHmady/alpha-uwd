import { useState, useEffect } from 'react';
import { documentService } from '@/services/documentService';

export const useDocuments = (fundId, token) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch documents for the fund
  const fetchDocuments = async () => {
    if (!fundId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentService.getDocumentsByFundId(fundId, token);
      console.log('Hook: Raw response from API:', response);
      
      // Backend returns {data: [...]} so we need to extract the data array
      const documentsArray = response?.data || response;
      console.log('Hook: Documents array:', documentsArray);
      
      // Ensure data is always an array
      setDocuments(Array.isArray(documentsArray) ? documentsArray : []);
    } catch (error) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', error);
      setDocuments([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch documents when fundId changes
  useEffect(() => {
    fetchDocuments();
  }, [fundId, token]);

  // Add new document
  const addDocument = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      console.log('Hook: Adding document with formData:', formData);
      await documentService.createDocument(formData, token);
      await fetchDocuments(); // Refresh the list
      setSuccessMessage('Document added successfully');
      return true;
    } catch (error) {
      console.error('Hook: Error adding document:', error);
      setError('Failed to add document');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update document
  const updateDocument = async (documentId, formData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await documentService.updateDocument(documentId, formData, token);
      await fetchDocuments(); // Refresh the list
      setSuccessMessage('Document updated successfully');
      return true;
    } catch (error) {
      setError('Failed to update document');
      console.error('Error updating document:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await documentService.deleteDocument(documentId, token);
      await fetchDocuments(); // Refresh the list
      setSuccessMessage('Document deleted successfully');
      return true;
    } catch (error) {
      setError('Failed to delete document');
      console.error('Error deleting document:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccessMessage('');
  };

  // Get document by ID
  const getDocumentById = (documentId) => {
    return documents.find(doc => doc.id === documentId);
  };

  return {
    // State
    documents,
    isLoading,
    error,
    successMessage,
    
    // Actions
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    clearMessages,
    getDocumentById,
  };
};

export default useDocuments;
