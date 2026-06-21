// redux/features/category/categorySelectors.js
export const selectCategories = (state) => state.category.categories;
export const selectCurrentCategory = (state) => state.category.currentCategory;
export const selectIsLoading = (state) => state.category.isLoading;
export const selectError = (state) => state.category.error;
export const selectSuccessMessage = (state) => state.category.successMessage;
export const selectSearchQuery = (state) => state.category.searchQuery;
export const selectFilteredCategories = (state) => state.category.filteredCategories;
export const selectNeedsRefetch = (state) => state.category.needsRefetch;
