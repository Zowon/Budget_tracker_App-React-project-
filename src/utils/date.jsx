import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

// Format date for input field (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

// Get month range for a given date
export const getMonthRange = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfMonth(dateObj),
    end: endOfMonth(dateObj)
  };
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}; 