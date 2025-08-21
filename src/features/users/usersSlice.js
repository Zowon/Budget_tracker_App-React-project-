import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  users: [
    {
      id: 'user-1',
      firstName: 'Guy',
      lastName: 'Hawkins',
      email: 'guy.hawkins@example.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin'
    },
    {
      id: 'user-2',
      firstName: 'Wade',
      lastName: 'Warren',
      email: 'wade.warren@example.com',
      phone: '+1 (555) 234-5678',
      role: 'User'
    },
    {
      id: 'user-3',
      firstName: 'Jenny',
      lastName: 'Wilson',
      email: 'jenny.wilson@example.com',
      phone: '+1 (555) 345-6789',
      role: 'User'
    },
    {
      id: 'user-4',
      firstName: 'Robert',
      lastName: 'Fox',
      email: 'robert.fox@example.com',
      phone: '+1 (555) 456-7890',
      role: 'Manager'
    }
  ]
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: {
      reducer: (state, action) => {
        // Check for duplicate email
        const existingUser = state.users.find(user => user.email === action.payload.email);
        if (!existingUser) {
          state.users.push(action.payload);
        }
      },
      prepare: (userData) => {
        const { password, ...userDataWithoutPassword } = userData;
        return {
          payload: {
            id: nanoid(),
            ...userDataWithoutPassword,
            // Store password hash if password is provided
            ...(password && { passwordHash: password }), // Will be hashed in component
            createdAt: new Date().toISOString()
          }
        };
      }
    },
    addUserFromAuth: (state, action) => {
      // Add user from auth signup without duplicate check
      const existingUser = state.users.find(user => user.email === action.payload.email);
      if (!existingUser) {
        const { passwordHash: _, ...userWithoutPassword } = action.payload;
        state.users.push(userWithoutPassword);
      }
    },
    updateUser: (state, action) => {
      const { id, ...updates } = action.payload;
      const existingUser = state.users.find(user => user.id === id);
      if (existingUser) {
        Object.assign(existingUser, updates);
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    }
  }
});

export const { addUser, addUserFromAuth, updateUser, deleteUser } = usersSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, userId) => 
  state.users.users.find(user => user.id === userId);
export const selectUserByEmail = (state, email) => 
  state.users.users.find(user => user.email === email);

export default usersSlice.reducer;
