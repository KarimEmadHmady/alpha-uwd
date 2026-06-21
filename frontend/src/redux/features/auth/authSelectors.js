// redux/features/auth/authSelectors.js
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectResetEmailSent = (state) => state.auth.resetEmailSent;
export const selectPasswordResetSuccess = (state) => state.auth.passwordResetSuccess;