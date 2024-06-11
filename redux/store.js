import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import settingsReducer from './settingsSlice';
import tasksReducer from './tasksSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
});

export default store;
