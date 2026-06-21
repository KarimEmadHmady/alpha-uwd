// redux/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersService } from '@/services/usersService';

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (token, { rejectWithValue }) => {
    try {
      console.log('fetchUsers thunk - Calling usersService.getAllUsers with token:', token);
      const users = await usersService.getAllUsers(token);
      console.log('fetchUsers thunk - Received users:', users);
      return users;
    } catch (error) {
      console.log('fetchUsers thunk - Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const user = await usersService.getUserById(id, token);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData, token }, { rejectWithValue }) => {
    try {
      const updatedUser = await usersService.updateUser(id, userData, token);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await usersService.deleteUser(id, token);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create user
export const createUser = createAsyncThunk(
  'users/createUser',
  async ({ userData, token }, { rejectWithValue }) => {
    try {
      const newUser = await usersService.createUser(userData, token);
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.currentUser && state.currentUser.id === action.payload) {
          state.currentUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentUser, clearCurrentUser, setPagination } = usersSlice.actions;
export default usersSlice.reducer;
