'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import PageSkeleton from '@/components/ui/PageSkeleton';

// Define the context type
type LoadingContextType = {
  isLoading: boolean;
  showLoader: (message?: string, type?: 'product' | 'blog' | 'general') => void;
  hideLoader: () => void;
};

// Create an empty context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider component
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [skeletonType, setSkeletonType] = useState<'product' | 'blog' | 'general'>('general');

  // Define the functions
  function showLoader(message = 'Loading...', type: 'product' | 'blog' | 'general' = 'general') {
    setLoadingMessage(message);
    setSkeletonType(type);
    setIsLoading(true);
  }

  function hideLoader() {
    setIsLoading(false);
  }

  // Create a stable value object that doesn't change on each render
  const value = React.useMemo(() => {
    return {
      isLoading,
      showLoader,
      hideLoader
    };
  }, [isLoading]); // Only depends on isLoading state

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{loadingMessage}</p>
            </div>
            <PageSkeleton type={skeletonType} />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

// Consumer hook
export function useLoading() {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    // Provide a fallback implementation instead of throwing an error
    return {
      isLoading: false,
      showLoader: () => console.warn('LoadingProvider not found'),
      hideLoader: () => console.warn('LoadingProvider not found')
    };
  }
  
  return context;
}
