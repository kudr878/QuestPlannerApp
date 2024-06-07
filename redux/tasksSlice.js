import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@env';

const getAuthHeaders = (state) => ({
  headers: {
    Authorization: `Bearer ${state.auth.token}`,
  }
});

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (userId, { getState }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/${userId}`, getAuthHeaders(getState()));
    return response.data;
  } catch (error) {
    console.error('Fetch tasks failed:', error);
    throw error;
  }
});

export const fetchTask = createAsyncThunk('tasks/fetchTask', async (taskId, { getState }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/task/${taskId}`, getAuthHeaders(getState()));
    return response.data;
  } catch (error) {
    console.error('Fetch task failed:', error);
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

export const toggleTaskCompletion = createAsyncThunk('tasks/toggleTaskCompletion', async (taskId, { getState }) => {
  const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}/toggle-completion`, {}, getAuthHeaders(getState()));
  return response.data;
});

export const addSubtask = createAsyncThunk('tasks/addSubtask', async ({ taskId, subtaskData }) => {
  const response = await axios.post(`${API_BASE_URL}/tasks/${taskId}/subtasks`, subtaskData);
  return { taskId, subtask: response.data };
});

export const updateSubtask = createAsyncThunk('tasks/updateSubtask', async ({ taskId, subtaskId, subtaskData }) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
  return { taskId, subtask: response.data };
});

export const deleteSubtask = createAsyncThunk('tasks/deleteSubtask', async ({ taskId, subtaskId }) => {
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`);
  return { taskId, subtaskId };
});

const getPluralForm = (number, forms) => {
  number = Math.abs(number) % 100; 
  const num = number % 10;
  if (number > 10 && number < 20) return forms[2];
  if (num > 1 && num < 5) return forms[1];
  if (num === 1) return forms[0];
  return forms[2];
};

const getTaskRepeatInfo = (task) => {
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const formatDateWithoutYear = (datetime) => {
    const date = new Date(datetime);
    const options = {
      month: 'long', day: 'numeric'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const formatDateWithoutDay = (datetime) => {
    const date = new Date(datetime);
    const options = {
      hour: 'numeric', minute: 'numeric'
    };
    return date.toLocaleTimeString('ru-RU', options);
  };

  switch (task.deadline_type_id) {
    case 1: 
      return ''; 
    case 2: 
      return task.deadline_date ? `${formatDateTime(task.deadline_date)}` : '';
    case 3: 
      return task.repeat_interval > 1 
        ? `Каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['день', 'дня', 'дней'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}`
        : `Ежедневно в ${formatDateTime(task.deadline_date).split(' ')[1]}`;
    case 4: 
      const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      const selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        .map((day, index) => task[day] ? daysOfWeek[index] : null)
        .filter(day => day !== null);
      return selectedDays.length > 0
        ? (task.repeat_interval > 1 
          ? `${selectedDays.join(', ')} каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['неделю', 'недели', 'недель'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}` 
          : `${selectedDays.join(', ')} в ${formatDateTime(task.deadline_date).split(' ')[1]}`)
        : '';
    case 5: 
      return task.repeat_interval > 1 
        ? `Каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['месяц', 'месяца', 'месяцев'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}`
        : `Каждый месяц ${formatDateWithoutYear(task.deadline_date)} в ${formatDateWithoutDay(task.deadline_date)}`;
    case 6: 
      return task.repeat_interval > 1 
        ? `Каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['год', 'года', 'лет'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}`
        : `Каждый год ${formatDateWithoutYear(task.deadline_date)} в ${formatDateTime(task.deadline_date).split(' ')[1]}`;
    default:
      return '';
  }
};

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
        state.tasks = action.payload.map(task => ({
          ...task,
          repeatInfo: getTaskRepeatInfo(task),
          subtasks: task.subtasks || [] // Ensure subtasks are included
        }));
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index === -1) {
          state.tasks.push({
            ...action.payload,
            repeatInfo: getTaskRepeatInfo(action.payload),
            subtasks: action.payload.subtasks || [] // Ensure subtasks are included
          });
        } else {
          state.tasks[index] = {
            ...action.payload,
            repeatInfo: getTaskRepeatInfo(action.payload),
            subtasks: action.payload.subtasks || [] // Ensure subtasks are included
          };
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push({
          ...action.payload,
          repeatInfo: getTaskRepeatInfo(action.payload),
          subtasks: action.payload.subtasks || [] // Ensure subtasks are included
        });
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = {
            ...action.payload,
            repeatInfo: getTaskRepeatInfo(action.payload),
            subtasks: action.payload.subtasks || [], // Ensure subtasks are included
            difficulty_name: action.payload.difficulty_name // Ensure difficulty name is included
          };
        }
      })      
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = {
            ...action.payload,
            repeatInfo: getTaskRepeatInfo(action.payload),
            subtasks: action.payload.subtasks || [], // Ensure subtasks are included
            difficulty_name: action.payload.difficulty_name // Ensure difficulty name is included
          };
        }
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        const task = state.tasks.find(task => task.id === action.payload.taskId);
        if (task) {
          task.subtasks.push(action.payload.subtask);
        }
      })
      .addCase(updateSubtask.fulfilled, (state, action) => {
        const task = state.tasks.find(task => task.id === action.payload.taskId);
        if (task) {
          const subtaskIndex = task.subtasks.findIndex(sub => sub.id === action.payload.subtask.id);
          if (subtaskIndex !== -1) {
            task.subtasks[subtaskIndex] = action.payload.subtask;
          }
        }
      })
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        const task = state.tasks.find(task => task.id === action.payload.taskId);
        if (task) {
          task.subtasks = task.subtasks.filter(sub => sub.id !== action.payload.subtaskId);
        }
      });
  }
});

export default tasksSlice.reducer;
