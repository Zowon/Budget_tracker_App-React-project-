import React from 'react';
import Button from '../inputs/Button';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item", 
  message = "Are you sure you want to delete this item?",
  itemName = ""
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirm-modal">
      <div className="delete-confirm-overlay" onClick={onClose}></div>
      <div className="delete-confirm-container">
        <div className="delete-confirm-header">
          <h2>{title}</h2>
          <button 
            type="button" 
            className="delete-confirm-close" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="delete-confirm-content">
          <p>{message}</p>
          {itemName && (
            <div className="item-name">
              <strong>{itemName}</strong>
            </div>
          )}
        </div>

        <div className="delete-confirm-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="delete-confirm-cancel"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            className="delete-confirm-delete"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
