import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateSettings = createAsyncThunk(
    'settings/updateSettings',
    async (userData, { getState, rejectWithValue }) => {
      const { user, token } = getState().auth;
      try {
        const response = await axios.put(`http://89.111.174.34:3000/users/${user.id}`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
