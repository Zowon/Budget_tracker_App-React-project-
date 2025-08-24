import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { selectUser } from '../features/auth/authSlice';
import { 
  selectUserExpenses
} from '../features/expenses/expensesSlice';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/forms/ExpenseForm';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Button from '../components/inputs/Button';
import AppLayout from '../components/layout/AppLayout';
import Toast from '../components/ui/Toast';
import calendarIcon from '../assets/calendar.png';
import './expenses.css';

const Expenses = () => {
  const user = useSelector(selectUser);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const itemsPerPage = 8;

  // Get all user expenses
  const allUserExpenses = useSelector(state => 
    selectUserExpenses(state, user?.id)
  );

  // Get monthly total (commented out for now)
  // const monthlyTotal = useSelector(state => 
  //   selectMonthlyTotal(state, user?.id, currentYear, currentMonth)
  // );

  // Check if over budget (commented out for now)
  // const isOverBudget = useSelector(state => 
  //   selectIsOverBudget(state, user, currentYear, currentMonth)
  // );

  // Filter expenses by search term and date (show all expenses up to selected date)
  const filteredExpenses = allUserExpenses.filter(expense => {
    // Filter by search term
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if expense should be visible based on selected date
    const expenseDate = new Date(expense.dateISO);
    const selectedEndDate = new Date(selectedDate);
    selectedEndDate.setHours(23, 59, 59, 999); // End of selected date
    
    // Show expense if it's on or before the selected date
    const isVisible = expenseDate <= selectedEndDate;
    
    return matchesSearch && isVisible;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'amount':
        return b.amount - a.amount;
      case 'date':
        return new Date(b.dateISO) - new Date(a.dateISO);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = sortedExpenses.slice(startIndex, startIndex + itemsPerPage);

  // Calculate remaining budget (commented out for now)
  // const remainingBudget = (user?.budgetLimit || 0) - monthlyTotal;

  // Handle edit expense
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowEditForm(true);
  };

  // Handle delete expense
  const handleDelete = (expense) => {
    setDeletingExpense(expense);
    setShowDeleteModal(true);
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ message, type, isVisible: true });
  };

  // Close toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Close modals
  const closeAddForm = (wasSuccessful = false) => {
    setShowAddForm(false);
    if (wasSuccessful === true) {
      showToast('Expense added successfully', 'success');
    }
  };
  const closeEditForm = (wasSuccessful = false) => {
    setShowEditForm(false);
    setEditingExpense(null);
    if (wasSuccessful === true) {
      showToast('Expense updated successfully', 'success');
    }
  };
  const closeDeleteModal = (wasSuccessful = false) => {
    setShowDeleteModal(false);
    setDeletingExpense(null);
    if (wasSuccessful === true) {
      showToast('Expense deleted successfully', 'success');
    }
  };

  // Format date for input
  const formatDateForInput = (date) => {
    return format(date, 'dd/MM/yyyy');
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <AppLayout>
    <div className="expenses-page">
        {/* Page Header with Controls */}
        <div className="expenses-header">
          <div className="header-left">
            <h1 className="page-title">Expenses</h1>
          </div>
          <div className="header-center">
            {/* Sort By */}
            <div className="sort-filter">
              <label htmlFor="sort-select" className="filter-label">Sort By</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="all">All</option>
                <option value="name">Name</option>
                <option value="amount">Amount</option>
                <option value="date">Date</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="date-filter">
              <label htmlFor="date-filter" className="filter-label">By Date</label>
              <div className="date-input-container">
                <input
                  type="text"
                  id="date-filter"
                  value={formatDateForInput(selectedDate)}
                  onChange={(e) => {
                    // Parse date from dd/MM/yyyy format
                    const [day, month, year] = e.target.value.split('/');
                    if (day && month && year) {
                      setSelectedDate(new Date(year, month - 1, day));
                    }
                  }}
                  className="date-input"
                  placeholder="dd/mm/yyyy"
                />
                <img src={calendarIcon} alt="Calendar" className="date-icon" />
              </div>
            </div>

            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="header-right">
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              className="add-expense-button"
            >
              Add Expenses
            </Button>
          </div>
        </div>

        {/* Expenses List */}
        <div className="expenses-content">
          <ExpenseList
            expenses={paginatedExpenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Pagination */}
        <div className="pagination-section">
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                ←
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
                  onClick={() => page !== '...' && goToPage(page)}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
              
              <button
                className="pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddForm && (
          <ExpenseForm
            onClose={closeAddForm}
            userId={user?.id}
            defaultDate={format(selectedDate, 'yyyy-MM-dd')}
          />
        )}

        {showEditForm && editingExpense && (
          <ExpenseForm
            expense={editingExpense}
            onClose={closeEditForm}
            userId={user?.id}
          />
        )}

        {showDeleteModal && deletingExpense && (
          <ConfirmDeleteModal
            expense={deletingExpense}
            onClose={closeDeleteModal}
          />
        )}

        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={closeToast}
        />
    </div>
    </AppLayout>
  );
};

export default Expenses; 