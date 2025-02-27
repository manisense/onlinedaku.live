'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { FaExclamationTriangle, FaTrash, FaSignOutAlt } from 'react-icons/fa';

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
  const styles = {
    danger: {
      icon: <FaTrash className="h-5 w-5 text-red-400" />,
      button: 'bg-red-500 hover:bg-red-600 text-gray-100',
      wrapper: 'border-red-700 bg-gray-800'
    },
    warning: {
      icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
      button: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900',
      wrapper: 'border-yellow-700 bg-gray-800'
    },
    info: {
      icon: <FaSignOutAlt className="h-5 w-5 text-blue-400" />,
      button: 'bg-blue-500 hover:bg-blue-600 text-gray-100',
      wrapper: 'border-blue-700 bg-gray-800'
    }
  };

  return (
    <div className={`rounded-lg shadow-xl border ${styles[type].wrapper} p-4 w-[320px]`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-0.5">
          {styles[type].icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            {message}
          </p>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm text-gray-300 hover:text-gray-100 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${styles[type].button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    const toastId = toast.custom(
      (t) => (
        <div 
          className={`${t.visible ? 'animate-fade-in' : 'animate-fade-out'}`}
          style={{ background: 'transparent' }}
        >
          <ConfirmDialog
            {...options}
            onConfirm={() => {
              toast.dismiss(toastId);
              resolve(true);
            }}
            onCancel={() => {
              toast.dismiss(toastId);
              resolve(false);
            }}
          />
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
        style: {
          background: 'transparent',
          boxShadow: 'none',
        },
      }
    );

    // Add keyboard support for Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toast.dismiss(toastId);
        resolve(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
  });
};

export const confirmDelete = (itemName: string) => confirm({
  title: `Delete ${itemName}`,
  message: `Are you sure you want to delete this ${itemName}?`,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  type: 'danger'
});

export const confirmLogout = () => confirm({
  title: 'Sign Out',
  message: 'Are you sure you want to sign out?',
  confirmText: 'Sign Out',
  cancelText: 'Cancel',
  type: 'info'
});

export const confirmStatusChange = (action: string, itemName: string) => confirm({
  title: `${action} ${itemName}`,
  message: `Are you sure you want to ${action.toLowerCase()} this ${itemName}?`,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'warning'
});

export default confirm;
