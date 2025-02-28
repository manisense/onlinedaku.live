'use client';

import { useCallback } from 'react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BlogPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: BlogPaginationProps) {
  const handlePageChange = useCallback((page: number) => {
    onPageChange(page);
  }, [onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md mr-2 bg-white border disabled:opacity-50"
        >
          Previous
        </button>
        
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md mx-1 ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md ml-2 bg-white border disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
