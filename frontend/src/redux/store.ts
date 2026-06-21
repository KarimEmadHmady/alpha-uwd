// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import usersReducer from './features/users/usersSlice';
import categoryReducer from './features/category/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;