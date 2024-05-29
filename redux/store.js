import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import settingsSlice from './settingsSlice';
import tasksReducer from './tasksSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsSlice,
    tasks: tasksReducer  
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
});

export default store;
