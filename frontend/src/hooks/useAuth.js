// hooks/useAuth.js
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  loginUser, 
  logoutUser, 
  clearError,
  clearResetState,
  updateUserProfile,
  forgotPassword,
  resetPassword
} from '@/redux/features/auth/authSlice';
import { 
  selectUser, 
  selectToken,
  selectIsAuthenticated, 
  selectIsLoading, 
  selectError 
} from '@/redux/features/auth/authSelectors';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const resetEmailSent = useAppSelector((state) => state.auth.resetEmailSent);
  const passwordResetSuccess = useAppSelector((state) => state.auth.passwordResetSuccess);

  // Login function
  const login = async (email, password) => {
    return dispatch(loginUser({ email, password })).unwrap();
  };

  // Logout function
  const logout = () => {
    dispatch(logoutUser());
  };

  // Clear error function
  const clearAuthError = () => {
    dispatch(clearError());
  };

  // Update profile function
  const updateProfile = (updatedUser) => {
    dispatch(updateUserProfile(updatedUser));
  };

  // Request password reset function
  const requestPasswordReset = async (email) => {
    return dispatch(forgotPassword(email)).unwrap();
  };

  // Reset password function
  const resetUserPassword = async (token, newPassword, email) => {
    return dispatch(resetPassword({ token, newPassword, email })).unwrap();
  };

  // Clear reset states function
  const clearResetStates = () => {
    dispatch(clearResetState());
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    resetEmailSent,
    passwordResetSuccess,
    
    // Actions
    login,
    logout,
    clearAuthError,
    updateProfile,
    requestPasswordReset,
    resetUserPassword,
    clearResetStates,
  };
};