'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Loader from '@/components/ui/Loader';

// Define the context type
type LoadingContextType = {
  isLoading: boolean;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
};

// Create an empty context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider component
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  // Define the functions
  function showLoader(message = 'Loading...') {
    setLoadingMessage(message);
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
      {isLoading && <Loader text={loadingMessage} />}
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
