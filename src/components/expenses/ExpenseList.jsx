import React from 'react';
import ExpenseItem from './ExpenseItem';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No expenses found</h3>
          <p>Start by adding your first expense to track your spending.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <table className="expense-table">
        <thead className="expense-table-header">
          <tr>
            <th className="header-expense">Expense</th>
            <th className="header-progress">Total Expenditure</th>
            <th className="header-amount">Price(PKR)</th>
            <th className="header-date">Date</th>
            <th className="header-actions">Actions</th>
          </tr>
        </thead>
        <tbody className="expense-table-body">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList; 