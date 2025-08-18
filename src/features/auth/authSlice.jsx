import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hashPassword } from '../../utils/crypto.jsx';

// Async thunk for signup
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, name, password, budgetLimit }) => {
    const passwordHash = await hashPassword(password);
    return {
      id: Date.now().toString(),
      email,
      name,
      budgetLimit: parseFloat(budgetLimit),
      passwordHash
    };
  }
);

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { getState }) => {
    const { auth } = getState();
    const passwordHash = await hashPassword(password);
    
    // Check if user exists and credentials match
    if (auth.user && auth.user.email === email && auth.user.passwordHash === passwordHash) {
      return auth.user;
    }
    
    // If no user exists, this is the first login - create a mock user
    if (!auth.user) {
      throw new Error('No account found. Please sign up first.');
    }
    
    // If user exists but credentials don't match
    if (auth.user.email !== email) {
      throw new Error('Email not found. Please check your email or sign up.');
    }
    
    if (auth.user.passwordHash !== passwordHash) {
      throw new Error('Invalid password. Please check your password.');
    }
    
    throw new Error('Invalid credentials');
  }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { getState }) => {
    const { auth } = getState();
    
    // Check if user exists and email matches
    if (auth.user && auth.user.email === email) {
      // Mock success - in real app would send email
      return { success: true, message: 'Password reset link sent to your email' };
    }
    
    // If no user exists
    if (!auth.user) {
      throw new Error('No account found. Please sign up first.');
    }
    
    // If user exists but email doesn't match
    if (auth.user.email !== email) {
      throw new Error('Email not found. Please check your email or sign up.');
    }
    
    throw new Error('Email not found');
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer; 