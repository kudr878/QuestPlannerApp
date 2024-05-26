import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://89.111.174.34:3000/register', userData);
    await SecureStore.setItemAsync('token', response.data.token);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://89.111.174.34:3000/login', userData);
    await SecureStore.setItemAsync('token', response.data.token);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const restoreUser = createAsyncThunk('auth/restoreUser', async (_, { rejectWithValue }) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const user = await SecureStore.getItemAsync('user');
    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return rejectWithValue('No token or user found');
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const verifyPassword = createAsyncThunk('auth/verifyPassword', async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://89.111.174.34:3000/verifyPassword', { username, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  });
  

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      SecureStore.deleteItemAsync('token');
      SecureStore.deleteItemAsync('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { updateUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
