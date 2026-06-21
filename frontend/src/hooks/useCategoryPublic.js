// hooks/useCategoryPublic.js
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { categoryService } from '@/services/categoryService';

export const useCategoryPublic = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const locale = useLocale();

  // Get all categories for frontend (without token)
  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await categoryService.getAllCategoriesPublic(locale);
      const categoriesData = response?.categories || response?.data || response;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [locale]);

  return {
    categories,
    isLoading,
    error,
    refetch: getAllCategories,
  };
};
