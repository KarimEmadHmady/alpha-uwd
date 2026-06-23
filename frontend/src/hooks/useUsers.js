// hooks/useUsers.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { usersService } from '@/services/usersService';
import {
  fetchUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  createUser,
  clearError,
  setCurrentUser,
  clearCurrentUser,
  setPagination,
} from '@/redux/features/users/usersSlice';

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;
export const selectPagination = (state) => state.users.pagination;

export const useUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectPagination);

  // Get auth token
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };

  // Fetch all users
  const fetchAllUsers = useCallback(async () => {
    const token = getToken();
    console.log('useUsers - Token from localStorage:', token);
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('useUsers - Dispatching fetchUsers...');
    return dispatch(fetchUsers(token));
  }, [dispatch]);

  // Fetch user by ID
  const fetchUser = useCallback(async (id) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return dispatch(fetchUserById({ id, token }));
  }, [dispatch]);

  // Update user
  const updateUserById = useCallback(async (id, userData) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return dispatch(updateUser({ id, userData, token }));
  }, [dispatch]);

  // Delete user
  const deleteUserById = useCallback(async (id) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return dispatch(deleteUser({ id, token }));
  }, [dispatch]);

  // Create user
  const createNewUser = useCallback(async (userData) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return dispatch(createUser({ userData, token }));
  }, [dispatch]);

  // Update current user bio
  const updateMyBio = useCallback(async (bio) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('useUsers - Updating bio:', bio);
    return usersService.updateBio(bio, token);
  }, []);

  // Update current user avatar
  const updateMyAvatar = useCallback(async (formData) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('useUsers - Updating avatar');
    return usersService.updateAvatar(formData, token);
  }, []);

  // Change password
  const changeMyPassword = useCallback(async (oldPassword, newPassword) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('useUsers - Changing password');
    return usersService.changePassword(oldPassword, newPassword, token);
  }, []);

  // Clear error
  const clearUsersError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Set current user
  const setCurrentUserState = useCallback((user) => {
    dispatch(setCurrentUser(user));
  }, [dispatch]);

  // Clear current user
  const clearCurrentUserState = useCallback(() => {
    dispatch(clearCurrentUser());
  }, [dispatch]);

  // Set pagination
  const setPaginationState = useCallback((paginationData) => {
    dispatch(setPagination(paginationData));
  }, [dispatch]);

  return {
    users,
    currentUser,
    isLoading,
    error,
    pagination,
    fetchAllUsers,
    fetchUserById,
    createNewUser,
    updateUserById,
    updateMyBio,
    updateMyAvatar,
    changeMyPassword,
    clearUsersError,
    clearCurrentUser,
    setPagination,
    deleteUserById
  };
};
