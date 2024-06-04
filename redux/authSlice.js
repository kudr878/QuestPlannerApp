import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import * as FileSystem from 'expo-file-system';
const logToFile = async (message) => {
  const fileUri = `${FileSystem.documentDirectory}log.txt`;
  const timestamp = new Date().toISOString();
  await FileSystem.writeAsStringAsync(fileUri, `${timestamp} - ${message}\n`, { encoding: FileSystem.EncodingType.UTF8, append: true });
};

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    await SecureStore.setItemAsync('token', response.data.token);
    await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
    await logToFile(`User registered: ${JSON.stringify(response.data.user)}`);
    return response.data;
  } catch (err) {
    await logToFile(`Register user error: ${err.message}`);
    return rejectWithValue(err.response.data);
  }
});


const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/login`, credentials);
  const token = response.data.token;
  const refreshToken = response.data.refreshToken;
  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return response.data;
});

export const restoreUser = createAsyncThunk('auth/restoreUser', async (_, { rejectWithValue }) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    const user = await SecureStore.getItemAsync('user');
    if (token && user) {
      setAuthToken(token);
      return { token, refreshToken, user: JSON.parse(user) };
    }
    return rejectWithValue('No token or user found');
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const refreshAuthToken = createAsyncThunk('auth/refreshAuthToken', async (_, { getState, rejectWithValue }) => {
  const { refreshToken } = getState().auth;
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, { token: refreshToken });
    const newToken = response.data.token;
    const newRefreshToken = response.data.refreshToken;
    await SecureStore.setItemAsync('token', newToken);
    await SecureStore.setItemAsync('refreshToken', newRefreshToken);
    setAuthToken(newToken);
    return { token: newToken, refreshToken: newRefreshToken };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');
    setAuthToken(null); 
    return;
  } catch (err) {
    return rejectWithValue(err);
  }
});
export const verifyPassword = createAsyncThunk('auth/verifyPassword', async ({ username, password }, { getState, rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verifyPassword`, { username, password });
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(refreshAuthToken());
        const response = await axios.post(`${API_BASE_URL}/verifyPassword`, { username, password });
        return response.data;
      } catch (refreshError) {
        await logToFile(`Verify password error after refresh: ${refreshError.message}`);
        return rejectWithValue(refreshError.response.data);
      }
    }
    await logToFile(`Verify password error: ${err.message}`);
    return rejectWithValue(err.response.data);
  }
});

export const sendVerificationCode = createAsyncThunk('auth/sendVerificationCode', async ({ email }, { getState, rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sendVerificationCode`, { email });
    await logToFile(`Verification code sent to: ${email}`);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(refreshAuthToken());
        const response = await axios.post(`${API_BASE_URL}/sendVerificationCode`, { email });
        await logToFile(`Verification code sent to: ${email}`);
        return response.data;
      } catch (refreshError) {
        await logToFile(`Send verification code error after refresh: ${refreshError.message}`);
        return rejectWithValue(refreshError.response.data);
      }
    }
    await logToFile(`Send verification code error: ${err.message}`);
    return rejectWithValue(err.response.data);
  }
});

export const verifyCode = createAsyncThunk('auth/verifyCode', async ({ email, code }, { getState, rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post('http://89.111.174.34:3000/verifyCode', { email, code });
    await logToFile(`Code verified for: ${email}`);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(refreshAuthToken());
        const response = await axios.post('http://89.111.174.34:3000/verifyCode', { email, code });
        await logToFile(`Code verified for: ${email}`);
        return response.data;
      } catch (refreshError) {
        await logToFile(`Verify code error after refresh: ${refreshError.message}`);
        return rejectWithValue(refreshError.response.data);
      }
    }
    await logToFile(`Verify code error: ${err.message}`);
    return rejectWithValue(err.response.data);
  }
});

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { getState, rejectWithValue, dispatch }) => {
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
    await logToFile('No changes in user data');
    return rejectWithValue('No changes');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        await dispatch(refreshAuthToken());
        const response = await axios.get(`${API_BASE_URL}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        });
        const newUser = { ...response.data, className: response.data.className };
        if (JSON.stringify(user) !== JSON.stringify(newUser)) {
          return newUser;
        }
        await logToFile('No changes in user data');
        return rejectWithValue('No changes');
      } catch (refreshError) {
        await logToFile(`Fetch user data error after refresh: ${refreshError.message}`);
        return rejectWithValue(refreshError.response.data);
      }
    }
    await logToFile(`Fetch user data error: ${error.message}`);
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
