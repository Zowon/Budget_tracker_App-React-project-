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
        state.users.push(action.payload);
      },
      prepare: (userData) => ({
        payload: {
          id: nanoid(),
          ...userData
        }
      })
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

export const { addUser, updateUser, deleteUser } = usersSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, userId) => 
  state.users.users.find(user => user.id === userId);

export default usersSlice.reducer;
