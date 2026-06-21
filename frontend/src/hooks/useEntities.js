import { useState, useEffect } from 'react';
import { entityService } from '@/services/entityService';

export const useEntities = (fundId, token) => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch entities for the fund
  const fetchEntities = async () => {
    if (!fundId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await entityService.getEntitiesByFundId(fundId, token);
      console.log('Hook: Raw response from API:', response);
      
      // Backend returns {data: [...]} so we need to extract the data array
      const entitiesArray = response?.data || response;
      console.log('Hook: Entities array:', entitiesArray);
      
      // Ensure data is always an array
      setEntities(Array.isArray(entitiesArray) ? entitiesArray : []);
    } catch (error) {
      setError('Failed to fetch entities');
      console.error('Error fetching entities:', error);
      setEntities([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch entities when fundId changes
  useEffect(() => {
    fetchEntities();
  }, [fundId, token]);

  // Add new entity
  const addEntity = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      console.log('Hook: Adding entity with formData:', formData);
      await entityService.createEntity(formData, token);
      await fetchEntities(); // Refresh the list
      setSuccessMessage('Entity added successfully');
      return true;
    } catch (error) {
      console.error('Hook: Error adding entity:', error);
      setError('Failed to add entity');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update entity
  const updateEntity = async (entityId, formData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await entityService.updateEntity(entityId, formData, token);
      await fetchEntities(); // Refresh the list
      setSuccessMessage('Entity updated successfully');
      return true;
    } catch (error) {
      setError('Failed to update entity');
      console.error('Hook: Error updating entity:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete entity
  const deleteEntity = async (entityId) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await entityService.deleteEntity(entityId, token);
      await fetchEntities(); // Refresh the list
      setSuccessMessage('Entity deleted successfully');
      return true;
    } catch (error) {
      setError('Failed to delete entity');
      console.error('Hook: Error deleting entity:', error);
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

  // Get entity by ID
  const getEntityById = (entityId) => {
    return entities.find(entity => entity.id === entityId);
  };

  return {
    // State
    entities,
    isLoading,
    error,
    successMessage,
    
    // Actions
    fetchEntities,
    addEntity,
    updateEntity,
    deleteEntity,
    clearMessages,
    getEntityById,
  };
};

export default useEntities;
