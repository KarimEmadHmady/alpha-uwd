// redux/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';

// Async thunk للـ login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk للـ logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk للـ forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk للـ reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword, email }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword, email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initialize state from localStorage if available
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          resetEmailSent: false,
          passwordResetSuccess: false,
        };
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    resetEmailSent: false,
    passwordResetSuccess: false,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // للـ logout العادي
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.resetEmailSent = false;
      state.passwordResetSuccess = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      authService.logout();
    },
    // لتحديث الـ user من localStorage
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    // لمسح حالات Reset Password
    clearResetState: (state) => {
      state.resetEmailSent = false;
      state.passwordResetSuccess = false;
      state.error = null;
    },
    // لتحديث بيانات المستخدم بعد التعديل
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update localStorage as well
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token;
        state.error = null;
        
        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', action.payload.token);
          localStorage.setItem('auth_user', JSON.stringify(state.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Logout Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.resetEmailSent = false;
        state.passwordResetSuccess = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      })
      
      // Forgot Password Cases
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.resetEmailSent = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetEmailSent = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.resetEmailSent = false;
      })
      
      // Reset Password Cases
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetSuccess = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.passwordResetSuccess = false;
      });
  },
});

export const { 
  logout, 
  setCredentials, 
  clearError, 
  clearResetState, 
  updateUserProfile 
} = authSlice.actions;

export default authSlice.reducer;