import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense, updateExpense } from '../../features/expenses/expensesSlice';
import FormField from '../inputs/FormField';
import Button from '../inputs/Button';
import './ExpenseForm.css';

const ExpenseForm = ({ 
  expense = null, 
  onClose, 
  userId, 
  defaultDate = new Date().toISOString().split('T')[0] 
}) => {
  const dispatch = useDispatch();
  const isEditing = !!expense;

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dateISO: defaultDate
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name,
        amount: expense.amount.toString(),
        dateISO: expense.dateISO.split('T')[0]
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Title is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.dateISO) {
      newErrors.dateISO = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const expenseData = {
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      dateISO: new Date(formData.dateISO).toISOString()
    };

    if (isEditing) {
      dispatch(updateExpense({
        id: expense.id,
        ...expenseData
      }));
    } else {
      dispatch(addExpense({
        userId,
        ...expenseData
      }));
    }

    onClose(true); // Pass true to indicate successful submission
  };

  return (
    <div className="expense-form-modal">
      <div className="expense-form-overlay" onClick={() => onClose()}></div>
      <div className="expense-form-container">
        <div className="expense-form-header">
          <h2>{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
          <button 
            type="button" 
            className="expense-form-close" 
            onClick={() => onClose()}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          <FormField
            label="Title"
            type="text"
            name="name"
            placeholder="Title"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <FormField
            label="Price(PKR)"
            type="number"
            name="amount"
            placeholder="Price"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            required
            step="0.01"
            min="0"
          />

          <FormField
            label="Date"
            type="date"
            name="dateISO"
            value={formData.dateISO}
            onChange={handleChange}
            error={errors.dateISO}
            required
          />

          <div className="expense-form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onClose()}
              className="expense-form-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="expense-form-submit"
            >
              {isEditing ? 'Save Changes' : 'Add'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm; 