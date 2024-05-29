import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './config';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Fetch tasks failed:', error);
      throw error;
    }
  });

export const addTask = createAsyncThunk('tasks/addTask', async (taskData) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ taskId, taskData }) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
  return taskId;
});

export const addSubtask = createAsyncThunk('tasks/addSubtask', async (subtaskData) => {
  const response = await axios.post(`${API_BASE_URL}/subtasks`, subtaskData);
  return response.data;
});

export const updateSubtask = createAsyncThunk('tasks/updateSubtask', async ({ subtaskId, subtaskData }) => {
  const response = await axios.put(`${API_BASE_URL}/subtasks/${subtaskId}`, subtaskData);
  return response.data;
});

export const deleteSubtask = createAsyncThunk('tasks/deleteSubtask', async (subtaskId) => {
  await axios.delete(`${API_BASE_URL}/subtasks/${subtaskId}`);
  return subtaskId;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        const task = state.tasks.find(task => task.id === action.payload.task_id);
        if (task) {
          task.subtasks = [...task.subtasks, action.payload];
        }
      })
      .addCase(updateSubtask.fulfilled, (state, action) => {
        const task = state.tasks.find(task => task.subtasks.find(sub => sub.id === action.payload.id));
        if (task) {
          const subIndex = task.subtasks.findIndex(sub => sub.id === action.payload.id);
          if (subIndex !== -1) {
            task.subtasks[subIndex] = action.payload;
          }
        }
      })
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        const task = state.tasks.find(task => task.subtasks.find(sub => sub.id === action.payload));
        if (task) {
          task.subtasks = task.subtasks.filter(sub => sub.id !== action.payload);
        }
      });
  }
});

export default tasksSlice.reducer;
