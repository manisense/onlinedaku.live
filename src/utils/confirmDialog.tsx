'use client';

import React from 'react';
import { toast } from 'react-toastify';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className="relative min-w-[320px] bg-white p-6 rounded-lg shadow-xl">
      <div className="flex flex-col items-center">
        <FaExclamationTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        <div className="flex justify-center space-x-4 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-red-400 bg-gray-400 border border-gray-300 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2  text-sm font-medium text-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    const toastId = toast(
      <ConfirmDialog
        {...options}
        onConfirm={() => {
          toast.dismiss(toastId);
          resolve(true);
          // Show success notification with timeout
        //   toast.success('Action confirmed', { autoClose: NOTIFICATION_TIMEOUT });
        }}
        onCancel={() => {
          toast.dismiss(toastId);
          resolve(false);
          // Show cancel notification with timeout
        //   toast.info('Action cancelled', { autoClose: NOTIFICATION_TIMEOUT });
        }}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        className: 'confirm-dialog-container',
        style: { 
          background: 'transparent',
          boxShadow: 'none',
          width: 'auto',
          padding: '0',
          margin: '0'
        },
        progressClassName: "confirm-dialog-progress"
      }
    );
  });
};

export const confirmDelete = (itemName: string) => confirm({
  title: 'Delete Confirmation',
  message: `Are you sure you want to delete this ${itemName}?`,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  type: 'danger'
});

export const confirmLogout = () => confirm({
  title: 'Logout Confirmation',
  message: 'Are you sure you want to end your session?',
  confirmText: 'Logout',
  cancelText: 'Stay',
  type: 'warning'
});

export const confirmStatusChange = (action: string, itemName: string) => confirm({
  title: 'Status Change Confirmation',
  message: `Are you sure you want to ${action} this ${itemName}?`,
  confirmText: 'Yes, proceed',
  cancelText: 'Cancel',
  type: 'warning'
});

// Add these styles to your globals.css
const styles = `
.confirm-dialog-container {
  max-width: 400px !important;
  width: auto !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.confirm-dialog-body {
  padding: 0 !important;
  margin: 0 !important;
}

.confirm-dialog-progress {
  background: transparent !important;
}

.Toastify__toast {
  padding: 0 !important;
  min-height: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default confirm;
