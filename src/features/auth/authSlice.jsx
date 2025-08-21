import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hashPassword } from '../../utils/crypto.jsx';

// Async thunk for signup
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ firstName, lastName, email, phone, role, password }, { getState }) => {
    const { users } = getState();
    
    // Check if email already exists
    const existingUser = users.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const passwordHash = await hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      role,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    
    return newUser;
  }
);

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { getState }) => {
    const { users, auth } = getState();
    const passwordHash = await hashPassword(password);
    
    // First check in users store, then in auth registeredUsers as fallback
    let user = users.users.find(u => u.email === email && u.passwordHash);
    
    if (!user && auth.registeredUsers) {
      user = auth.registeredUsers.find(u => u.email === email);
    }
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    if (user.passwordHash !== passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { getState }) => {
    const { users, auth } = getState();
    
    // Check in users store first, then auth registeredUsers
    let userExists = users.users.find(u => u.email === email);
    
    if (!userExists && auth.registeredUsers) {
      userExists = auth.registeredUsers.find(u => u.email === email);
    }
    
    if (userExists) {
      // Mock success - in real app would send email
      return { success: true, message: 'Reset link sent' };
    }
    
    throw new Error('Account not found');
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registeredUsers: [] // Keep track of registered users for auth
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Only clear current user session, keep registeredUsers for future logins
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Do NOT clear registeredUsers - they should persist
    },
    clearError: (state) => {
      state.error = null;
    },
    addRegisteredUser: (state, action) => {
      // Avoid duplicates
      const existingUser = state.registeredUsers.find(u => u.email === action.payload.email);
      if (!existingUser) {
        state.registeredUsers.push(action.payload);
      }
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
        const { passwordHash: _, ...userWithoutPassword } = action.payload;
        state.user = userWithoutPassword;
        state.isAuthenticated = true;
        state.registeredUsers.push(action.payload);
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

export const { logout, clearError, addRegisteredUser } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer; 