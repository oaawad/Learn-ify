import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

// Get user from localStorage
const user = localStorage.getItem('user');
const country = localStorage.getItem('country');

const initialState = {
  user: user ? user : null,
  country: country ? country : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user
export const register = createAsyncThunk('user/register', async (user, thunkAPI) => {
  try {
    return await userService.register(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Login user
export const login = createAsyncThunk('user/login', async (user, thunkAPI) => {
  try {
    return await userService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('user/logout', async () => {
  await userService.logout();
});

export const setCountry = createAsyncThunk('user/setCountry', async (userData, thunkAPI) => {
  try {
    return await userService.setCountry(userData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateWatchedDuration = createAsyncThunk(
  'user/updateWatchedDuration',
  async (userData, thunkAPI) => {
    try {
      return await userService.updateWatchedDuration(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const addCourse = createAsyncThunk('user/addCourse', async (userData, thunkAPI) => {
  try {
    return await userService.addCourse(userData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const requestCourse = createAsyncThunk('user/requestCourse', async (userData, thunkAPI) => {
  try {
    return await userService.requestCourse(userData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.country = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.country = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.country = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.country = null;
      })
      .addCase(setCountry.fulfilled, (state, action) => {
        state.country = action.payload;
      })
      .addCase(updateWatchedDuration.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(requestCourse.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
