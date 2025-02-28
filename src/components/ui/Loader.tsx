import React from 'react';
import Image from 'next/image';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  text,
  overlay = false
}) => {
  const sizeClasses = {
    small: {
      wrapper: 'h-8 w-8',
      image: 16,
      border: 'border-2'
    },
    medium: {
      wrapper: 'h-16 w-16',
      image: 32,
      border: 'border-3'
    },
    large: {
      wrapper: 'h-24 w-24',
      image: 48,
      border: 'border-4'
    }
  };

  const Container = overlay ? 'div' : 'span';

  return (
    <Container className={`
      ${overlay ? 'fixed inset-0 bg-black/20 backdrop-blur-sm z-50' : 'inline-block'}
      flex items-center justify-center duration-300 ease-in-out flex-col
    `}>
      <div className="relative">
        {/* Spinning Border */}
        <div className={`
          ${sizeClasses[size].wrapper}
          ${sizeClasses[size].border}
          rounded-full
          border-t-indigo-600
          border-r-indigo-600/40
          border-b-indigo-600/20
          border-l-indigo-600/60
          animate-spin
        `} />
        
        {/* Centered Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={sizeClasses[size].image}
            height={sizeClasses[size].image}
            className="object-contain"
          />
        </div>
      </div>
      <div>
      {text && <div className="mt-2 text-indigo-600">{text}</div>}
      </div>
      
    </Container>
  );
};

export default Loader;
