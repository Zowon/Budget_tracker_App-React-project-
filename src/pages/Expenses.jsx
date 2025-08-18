import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { selectUser } from '../features/auth/authSlice';
import { 
  selectExpensesByMonth
} from '../features/expenses/expensesSlice';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/forms/ExpenseForm';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import Button from '../components/inputs/Button';
import AppLayout from '../components/layout/AppLayout';
import searchIcon from '../assets/Search.png';
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
  const itemsPerPage = 8;

  // Get current month/year for selectors
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth() + 1; // 1-indexed for selector

  // Get expenses for current month
  const expenses = useSelector(state => 
    selectExpensesByMonth(state, user?.id, currentYear, currentMonth)
  );

  // Get monthly total (commented out for now)
  // const monthlyTotal = useSelector(state => 
  //   selectMonthlyTotal(state, user?.id, currentYear, currentMonth)
  // );

  // Check if over budget (commented out for now)
  // const isOverBudget = useSelector(state => 
  //   selectIsOverBudget(state, user, currentYear, currentMonth)
  // );

  // Filter and sort expenses
  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Close modals
  const closeAddForm = () => setShowAddForm(false);
  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingExpense(null);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingExpense(null);
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
              <img src={searchIcon} alt="Search" className="search-icon" />
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
          <div className="pagination-info">
            <span className="pagination-text">
              Showing {startIndex + 1} / {sortedExpenses.length}
            </span>
          </div>
          
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
    </div>
    </AppLayout>
  );
};

export default Expenses; 