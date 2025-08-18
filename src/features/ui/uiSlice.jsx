import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDateISO: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  reportRange: '6m', // '1m' | '6m' | '12m'
  toasts: []
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDateISO = action.payload;
    },
    setReportRange: (state, action) => {
      state.reportRange = action.payload;
    },
    addToast: (state, action) => {
      const toast = {
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type || 'info', // 'success' | 'error' | 'info' | 'warning'
        duration: action.payload.duration || 5000
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    }
  }
});

export const { 
  setSelectedDate, 
  setReportRange, 
  addToast, 
  removeToast, 
  clearToasts 
} = uiSlice.actions;

export default uiSlice.reducer; 