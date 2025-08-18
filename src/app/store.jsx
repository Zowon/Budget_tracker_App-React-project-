import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import expensesReducer from '../features/expenses/expensesSlice';
import usersReducer from '../features/users/usersSlice';
import uiReducer from '../features/ui/uiSlice';

// Persist configuration for auth and expenses
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated']
};

const expensesPersistConfig = {
  key: 'expenses',
  storage,
  whitelist: ['expenses']
};

const usersPersistConfig = {
  key: 'users',
  storage,
  whitelist: ['users']
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedExpensesReducer = persistReducer(expensesPersistConfig, expensesReducer);
const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    expenses: persistedExpensesReducer,
    users: persistedUsersReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store); 