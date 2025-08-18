import React from 'react';
import { format } from 'date-fns';
import './ExpenseItem.css';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const formatDate = (dateISO) => {
    return format(new Date(dateISO), 'dd MMM yyyy');
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString();
  };

  // Calculate progress percentage (mock data for now)
  const getProgressPercentage = () => {
    // This would typically be calculated based on budget vs spent
    // For now, using a random percentage for demonstration
    return Math.floor(Math.random() * 100) + 1;
  };

  const progressPercentage = getProgressPercentage();

  // Generate mock user name from expense ID
  const getUserName = (expenseId) => {
    const users = ['guy-hawkins', 'wade-warren', 'jenny-wilson', 'robert-fox', 'williamson', 'ralph-edwards', 'marvin-mckinney'];
    const index = expenseId.charCodeAt(0) % users.length;
    return users[index];
  };

  return (
    <tr className="expense-item">
      <td className="expense-name">
        <span className="expense-name-text">{expense.name}</span>
      </td>
      <td className="expense-progress">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">{progressPercentage}%</span>
        </div>
      </td>
      <td className="expense-amount">
        <span className="amount-text">{formatAmount(expense.amount)}</span>
      </td>
      <td className="expense-date">
        <span className="date-text">{formatDate(expense.dateISO)}</span>
      </td>
      <td className="expense-user">
        <span className="user-text">{getUserName(expense.id)}</span>
      </td>
      <td className="expense-actions">
        <div className="action-buttons">
          <button
            type="button"
            className="action-button action-edit"
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
            title="Edit expense"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            type="button"
            className="action-button action-delete"
            onClick={() => onDelete(expense)}
            aria-label="Delete expense"
            title="Delete expense"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseItem; 