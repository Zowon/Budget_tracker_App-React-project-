import { createSlice, createSelector } from '@reduxjs/toolkit';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { nanoid } from 'nanoid';

const initialState = {
  expenses: [],
  loading: false,
  error: null
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      const { userId, dateISO, name, amount } = action.payload;
      const newExpense = {
        id: nanoid(),
        userId,
        dateISO,
        name,
        amount: parseFloat(amount)
      };
      state.expenses.push(newExpense);
    },
    updateExpense: (state, action) => {
      const { id, dateISO, name, amount } = action.payload;
      const expenseIndex = state.expenses.findIndex(expense => expense.id === id);
      if (expenseIndex !== -1) {
        state.expenses[expenseIndex] = {
          ...state.expenses[expenseIndex],
          dateISO,
          name,
          amount: parseFloat(amount)
        };
      }
    },
    removeExpense: (state, action) => {
      const { id } = action.payload;
      state.expenses = state.expenses.filter(expense => expense.id !== id);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  addExpense, 
  updateExpense, 
  removeExpense, 
  setLoading, 
  setError, 
  clearError 
} = expensesSlice.actions;

// Selectors
export const selectAllExpenses = (state) => state.expenses.expenses;
export const selectExpensesLoading = (state) => state.expenses.loading;
export const selectExpensesError = (state) => state.expenses.error;

// Select expenses by month using date-fns
export const selectExpensesByMonth = createSelector(
  [selectAllExpenses, (state, userId, year, month) => ({ userId, year, month })],
  (expenses, { userId, year, month }) => {
    const targetDate = new Date(year, month - 1); // month is 0-indexed in JS Date
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    return expenses.filter(expense => {
      if (expense.userId !== userId) return false;
      
      const expenseDate = parseISO(expense.dateISO);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });
  }
);

// Select monthly total
export const selectMonthlyTotal = createSelector(
  [selectExpensesByMonth],
  (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }
);

// Select if over budget
export const selectIsOverBudget = createSelector(
  [selectMonthlyTotal, (state, user) => user?.budgetLimit || 0],
  (monthlyTotal, budgetLimit) => {
    return monthlyTotal > budgetLimit;
  }
);

// Select expenses for current user
export const selectUserExpenses = createSelector(
  [selectAllExpenses, (state, userId) => userId],
  (expenses, userId) => {
    return expenses.filter(expense => expense.userId === userId);
  }
);

// Select expense by ID
export const selectExpenseById = createSelector(
  [selectAllExpenses, (state, expenseId) => expenseId],
  (expenses, expenseId) => {
    return expenses.find(expense => expense.id === expenseId);
  }
);

export default expensesSlice.reducer; 