import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllUsers, addUser, updateUser, deleteUser } from '../features/users/usersSlice';
import { hashPassword } from '../utils/crypto.jsx';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/inputs/Button';
import UserForm from '../components/forms/UserForm';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import Toast from '../components/ui/Toast';
import searchIcon from '../assets/Search.png';
import './users.css';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const itemsPerPage = 8;

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  // Handle delete user
  const handleDelete = (user) => {
    setDeletingUser(user);
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

  // Handle user form submit
  const handleUserSubmit = async (userData) => {
    try {
      if (editingUser) {
        dispatch(updateUser({ id: editingUser.id, ...userData }));
        setShowEditForm(false);
        setEditingUser(null);
        showToast('User updated successfully', 'success');
      } else {
        // Check for duplicate email
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
          showToast('Email already exists', 'error');
          return;
        }
        
        // For new users, hash the password before storing
        if (userData.password) {
          const passwordHash = await hashPassword(userData.password);
          const userWithHashedPassword = {
            ...userData,
            passwordHash,
            password: undefined // Remove plain password
          };
          dispatch(addUser(userWithHashedPassword));
        } else {
          dispatch(addUser(userData));
        }
        setShowAddForm(false);
        showToast('User created successfully', 'success');
      }
    } catch {
      showToast('Operation failed', 'error');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deletingUser) {
      dispatch(deleteUser(deletingUser.id));
      setShowDeleteModal(false);
      setDeletingUser(null);
      showToast('User deleted successfully', 'success');
    }
  };

  // Close modals
  const closeAddForm = () => setShowAddForm(false);
  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingUser(null);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
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
      <div className="users-page">
        {/* Page Header with Controls */}
        <div className="users-header">
          <div className="header-left">
            <h1 className="page-title">Users</h1>
          </div>
          <div className="header-center">
            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
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
              className="add-user-button"
            >
              Add User
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-content">
          <div className="users-table-container">
            <table className="users-table">
              <thead className="users-table-header">
                <tr>
                  <th className="header-name">Name</th>
                  <th className="header-email">Email</th>
                  <th className="header-phone">Phone</th>
                  <th className="header-role">Role</th>
                  <th className="header-actions">Actions</th>
                </tr>
              </thead>
              <tbody className="users-table-body">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <div className="empty-content">
                        <div className="empty-icon">👥</div>
                        <h3>No users found</h3>
                        <p>Start by adding your first user to manage the team.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="user-item">
                      <td className="user-name">
                        <div className="user-name-container">
                          <div className="user-avatar">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div className="user-name-text">
                            <span className="user-full-name">{user.firstName} {user.lastName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="user-email">
                        <span className="email-text">{user.email}</span>
                      </td>
                      <td className="user-phone">
                        <span className="phone-text">{user.phone}</span>
                      </td>
                      <td className="user-role">
                        <span className={`role-badge role-${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="user-actions">
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="action-button action-edit"
                            onClick={() => handleEdit(user)}
                            aria-label="Edit user"
                            title="Edit user"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="action-button action-delete"
                            onClick={() => handleDelete(user)}
                            aria-label="Delete user"
                            title="Delete user"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-section">
            <div className="pagination-info">
              <span className="pagination-text">
                Showing {startIndex + 1} / {filteredUsers.length}
              </span>
            </div>
            
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
          </div>
        )}

        {/* Delete Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message="Are you sure you want to delete this user?"
          itemName={deletingUser ? `${deletingUser.firstName} ${deletingUser.lastName}` : ""}
        />

        {showAddForm && (
          <UserForm
            onClose={closeAddForm}
            onSubmit={handleUserSubmit}
          />
        )}

        {showEditForm && editingUser && (
          <UserForm
            user={editingUser}
            onClose={closeEditForm}
            onSubmit={handleUserSubmit}
          />
        )}

        {showDeleteModal && deletingUser && (
          <DeleteConfirmModal
            title="Delete User"
            message={`Are you sure you want to delete ${deletingUser.firstName} ${deletingUser.lastName}? This action cannot be undone.`}
            onConfirm={handleDeleteConfirm}
            onCancel={closeDeleteModal}
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

export default Users;
