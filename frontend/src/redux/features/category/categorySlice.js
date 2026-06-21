// redux/features/category/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '@/services/categoryService';

// Async thunks
export const selectNeedsRefetch = (state) => state.category.needsRefetch;
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async ({ lang = 'en' }, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories(lang);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoriesWithTranslations = createAsyncThunk(
  'category/fetchCategoriesWithTranslations',
  async (token, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategoriesWithTranslations(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async ({ id, lang = 'en' }, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id, lang);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async ({ categoryData, token }, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, categoryData, token }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id, token);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  successMessage: null,
  searchQuery: '',
  filteredCategories: [],
  needsRefetch: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      const categories = Array.isArray(state.categories) ? state.categories : [];
      state.filteredCategories = categories.filter(category =>
        category.name && category.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        (category.name_ar && category.name_ar.toLowerCase().includes(action.payload.toLowerCase()))
      );
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearNeedsRefetch: (state) => {
      state.needsRefetch = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
        state.filteredCategories = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Categories with Translations
      .addCase(fetchCategoriesWithTranslations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithTranslations.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('API Response:', action.payload);
        // Extract data from the response object
        const categories = action.payload?.data ? action.payload.data : Array.isArray(action.payload) ? action.payload : [];
        console.log('Extracted categories:', categories);
        // Process categories to extract English and Arabic names
        const processedCategories = categories.map(category => ({
          ...category,
          name: category.translations?.en?.name || category.name || '',
          name_ar: category.translations?.ar?.name || category.name_arabic || category.name_ar || '',
        }));
        console.log('Processed Categories:', processedCategories);
        state.categories = processedCategories;
        state.filteredCategories = processedCategories;
        state.error = null;
      })
      .addCase(fetchCategoriesWithTranslations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Category By ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Create API Response:', action.payload);
        
        // API returns success message with data object
        if (action.payload?.data) {
          if (!Array.isArray(state.categories)) {
            state.categories = [];
          }
          // Process the new category from action.payload.data
          const processedCategory = {
            ...action.payload.data,
            name: action.payload.data.translations?.en?.name || action.payload.data.name || '',
            name_ar: action.payload.data.translations?.ar?.name || action.payload.data.name_arabic || action.payload.data.name_ar || '',
          };
          console.log('Processed new category:', processedCategory);
          
          // Always trigger refetch for create to get the complete data
          state.needsRefetch = true;
        }
        console.log('Categories after create:', state.categories);
        state.successMessage = 'Category created successfully!';
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Update API Response:', action.payload);
        
        // API only returns success message, not the updated category
        // We need to refetch the categories to get the updated data
        state.successMessage = 'Category updated successfully!';
        state.error = null;
        
        // Trigger a refetch by setting a flag
        state.needsRefetch = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.categories)) {
          state.categories = [];
        }
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        state.filteredCategories = [...state.categories];
        state.successMessage = 'Category deleted successfully!';
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSuccessMessage, 
  setSearchQuery, 
  clearCurrentCategory,
  clearNeedsRefetch
} = categorySlice.actions;

export default categorySlice.reducer;
