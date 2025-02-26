import Image from 'next/image';
import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };
  
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated circle spinner */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin`}></div>
        
        {/* SVG logo in center */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <Image src="/logo.svg" alt="Logo" width={size === 'large' ? 40 : 24} height={size === 'large' ? 40 : 24} />
        </div>
      </div>
      
      {text && (
        <p className={`mt-3 ${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {loaderContent}
        </div>
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
