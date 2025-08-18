import React from 'react';
import { useDispatch } from 'react-redux';
import { removeExpense } from '../../features/expenses/expensesSlice';
import Button from '../inputs/Button';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ expense, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(removeExpense({ id: expense.id }));
    onClose();
  };

  if (!expense) return null;

  return (
    <div className="confirm-delete-modal">
      <div className="confirm-delete-overlay" onClick={onClose}></div>
      <div className="confirm-delete-container">
        <div className="confirm-delete-header">
          <h2>Delete Expense</h2>
          <button 
            type="button" 
            className="confirm-delete-close" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="confirm-delete-content">
          <p>Are you sure you want to delete this expense?</p>
          
          <div className="expense-details">
            <div className="expense-detail">
              <span className="expense-detail-label">Title:</span>
              <span className="expense-detail-value">{expense.name}</span>
            </div>
            <div className="expense-detail">
              <span className="expense-detail-label">Price(PKR):</span>
              <span className="expense-detail-value">{expense.amount.toLocaleString()}</span>
            </div>
            <div className="expense-detail">
              <span className="expense-detail-label">Date:</span>
              <span className="expense-detail-value">
                {new Date(expense.dateISO).toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>
        </div>

        <div className="confirm-delete-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="confirm-delete-cancel"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            className="confirm-delete-delete"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal; 