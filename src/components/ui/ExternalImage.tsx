"use client";

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { FaImage } from 'react-icons/fa';

// ExternalImage component that handles loading states and errors for external images
export default function ExternalImage({ 
  src, 
  alt, 
  width = 200, 
  height = 200, 
  className = '',
  ...props 
}: ImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!src || error) {
    // Fallback when no image is available or on error
    return (
      <div 
        className={`relative flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <FaImage className="text-gray-400" size={Math.min(Number(width), Number(height)) / 3} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse bg-gray-200 rounded" style={{ width: '80%', height: '80%' }}></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt || "Product image"}
        width={width}
        height={height}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        {...props}
      />
    </div>
  );
}
