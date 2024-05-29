import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {API_BASE_URL} from './config';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    await SecureStore.setItemAsync('token', response.data.token);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
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
      const response = await axios.post(`${API_BASE_URL}/verifyPassword`, { username, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  });
  export const sendVerificationCode = createAsyncThunk('auth/sendVerificationCode', async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sendVerificationCode`, { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  });
  
  export const verifyCode = createAsyncThunk('auth/verifyCode', async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://89.111.174.34:3000/verifyCode', { email, code });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  });

  export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      return;
    } catch (err) {
      return rejectWithValue(err);
    }
  });

  export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { getState, rejectWithValue }) => {
    const { user, token } = getState().auth;
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newUser = { ...response.data, className: response.data.className };
      if (JSON.stringify(user) !== JSON.stringify(newUser)) {
        return newUser;
      }
      return rejectWithValue('No changes'); 
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      clearUser: (state) => {
        state.user = null;
        state.token = null;
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
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
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.status = 'verificationCodeSent';
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.status = 'codeVerified';
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { updateUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
