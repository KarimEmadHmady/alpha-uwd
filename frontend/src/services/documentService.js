// Document Service - Handles all document-related API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const documentService = {
  // Get all documents for a specific fund
  getDocumentsByFundId: async (fundId, token) => {
    try {   
      const response = await fetch(`${API_BASE_URL}/api/documents/fund/${fundId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Create a new document
  createDocument: async (formData, token) => {
    try {

      for (let [key, value] of formData.entries()) {
      }    
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData, 
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Service: Error creating document:', error);
      throw error;
    }
  },

  // Update an existing document
  updateDocument: async (documentId, formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (documentId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true; // Return true on successful deletion
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};

export default documentService;
