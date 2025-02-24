'use client';

import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

interface BulkActionsProps {
  selectedDeals: string[];
  onBulkDelete: () => void;
  onBulkStatusChange: (status: boolean) => void;
  onClearSelection: () => void;
}

export default function BulkActions({ 
  selectedDeals, 
  onBulkDelete, 
  onBulkStatusChange,
  onClearSelection 
}: BulkActionsProps) {
  if (selectedDeals.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-indigo-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <FaCheck className="h-6 w-6 text-white" />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">
                  {selectedDeals.length} selected
                </span>
                <span className="hidden md:inline">
                  {selectedDeals.length} deals selected
                </span>
              </p>
            </div>
            <div className="mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto">
              <div className="flex space-x-4">
                <button
                  onClick={() => onBulkStatusChange(true)}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  <FaCheck className="mr-2" />
                  Activate
                </button>
                <button
                  onClick={() => onBulkStatusChange(false)}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  <FaTimes className="mr-2" />
                  Deactivate
                </button>
                <button
                  onClick={onBulkDelete}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
                <button
                  onClick={onClearSelection}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 