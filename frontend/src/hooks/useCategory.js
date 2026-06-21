// hooks/useCategory.js
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useAuth } from '@/hooks/useAuth';
import {
  selectCategories,
  selectCurrentCategory,
  selectIsLoading,
  selectError,
  selectSuccessMessage,
  selectSearchQuery,
  selectFilteredCategories,
  selectNeedsRefetch,
} from '@/redux/features/category/categorySelectors';
import {
  fetchCategories,
  fetchCategoriesWithTranslations,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  clearSuccessMessage,
  setSearchQuery,
  clearCurrentCategory,
  clearNeedsRefetch,
} from '@/redux/features/category/categorySlice';

export const useCategory = () => {
  const dispatch = useAppDispatch();
  
  // Get token from auth state
  const { token } = useAuth();

  // Selectors
  const categories = useAppSelector(selectCategories);
  const currentCategory = useAppSelector(selectCurrentCategory);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const successMessage = useAppSelector(selectSuccessMessage);
  const searchQuery = useAppSelector(selectSearchQuery);
  const filteredCategories = useAppSelector(selectFilteredCategories);
  const needsRefetch = useAppSelector(selectNeedsRefetch);

  // Actions
  const getCategories = async (lang = 'en') => {
    return dispatch(fetchCategories({ lang })).unwrap();
  };

  const getCategoriesWithTranslations = async (token) => {
    return dispatch(fetchCategoriesWithTranslations(token)).unwrap();
  };

  const getCategoryById = async (id, lang = 'en') => {
    return dispatch(fetchCategoryById({ id, lang })).unwrap();
  };

  const addCategory = async (categoryData, token) => {
    return dispatch(createCategory({ categoryData, token })).unwrap();
  };

  const editCategory = async (id, categoryData, token) => {
    return dispatch(updateCategory({ id, categoryData, token })).unwrap();
  };

  const removeCategory = async (id, token) => {
    return dispatch(deleteCategory({ id, token })).unwrap();
  };

  const clearCategoryError = () => {
    dispatch(clearError());
  };

  const clearCategorySuccessMessage = () => {
    dispatch(clearSuccessMessage());
  };

  const setCategorySearchQuery = (query) => {
    dispatch(setSearchQuery(query));
  };

  const resetCurrentCategory = () => {
    dispatch(clearCurrentCategory());
  };

  // Auto-refetch when needed
  useEffect(() => {
    if (needsRefetch && token) {
      getCategoriesWithTranslations(token);
      // Reset the refetch flag
      dispatch(clearNeedsRefetch());
    }
  }, [needsRefetch, token]);

  return {
    // State
    categories,
    currentCategory,
    isLoading,
    error,
    successMessage,
    searchQuery,
    filteredCategories,
    needsRefetch,

    // Actions
    getCategories,
    getCategoriesWithTranslations,
    getCategoryById,
    addCategory,
    editCategory,
    removeCategory,
    clearCategoryError,
    clearCategorySuccessMessage,
    setCategorySearchQuery,
    resetCurrentCategory,
  };
};
