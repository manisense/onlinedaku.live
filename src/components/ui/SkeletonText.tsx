import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonTextProps {
  lines?: number;
  width?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

const SkeletonText: React.FC<SkeletonTextProps> = ({ 
  lines = 3, 
  width = '100%', 
  className = '',
  animation = 'wave'
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 && typeof width === 'string' ? `calc(${width} * 0.6)` : width}
          animation={animation}
        />
      ))}
    </div>
  );
};

export default SkeletonText; 