import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import settingsSlice from './settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsSlice,
  },
});

export default store;
