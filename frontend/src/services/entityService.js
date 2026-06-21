// Entity Service - Handles all entity-related API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const entityService = {
  // Get all entities for a specific fund
  getEntitiesByFundId: async (fundId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/entities/fund/${fundId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  },

  // Create a new entity
  createEntity: async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/entities`, {
        method: 'POST',
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
      console.error('Service: Error creating entity:', error);
      throw error;
    }
  },

  // Update an existing entity
  updateEntity: async (entityId, formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/entities/${entityId}`, {
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
      console.error('Error updating entity:', error);
      throw error;
    }
  },

  // Delete an entity
  deleteEntity: async (entityId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/entities/${entityId}`, {
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
      console.error('Error deleting entity:', error);
      throw error;
    }
  }
};

export default entityService;
