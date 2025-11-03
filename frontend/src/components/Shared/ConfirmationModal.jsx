// frontend/src/components/Shared/ConfirmationModal.jsx
import React from 'react';
import '../../styles/ConfirmationModal.css'; // Novo CSS
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) => {
  return (
    <div className="modal-backdrop-confirm">
      <div className="modal-content-confirm">
        <div className="modal-icon-confirm">
          <FaExclamationTriangle />
        </div>
        <h2 className="modal-title-confirm">{title}</h2>
        <p className="modal-message-confirm">{message}</p>
        <div className="modal-actions-confirm">
          <button className="btn-cancel-confirm" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn-confirm-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;