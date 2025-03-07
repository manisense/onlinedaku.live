import React from 'react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

interface SkeletonCardProps {
  count?: number;
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1, className = '' }) => {
  const singleCard = (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden h-full ${className}`}>
      {/* Badge placeholders */}
      <div className="relative">
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <Skeleton 
            variant="rectangular" 
            width={70} 
            height={20} 
            className="rounded-full" 
            animation="wave" 
          />
        </div>
        
        {/* Discount badge */}
        <div className="absolute top-3 right-3 z-10">
          <Skeleton 
            variant="rectangular" 
            width={60} 
            height={20} 
            className="rounded-full" 
            animation="wave" 
          />
        </div>
        
        {/* Image placeholder */}
        <Skeleton 
          variant="rectangular" 
          height={180} 
          className="w-full" 
          animation="wave" 
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title placeholder */}
        <Skeleton 
          variant="text" 
          width="90%" 
          height={24}
          className="mb-2" 
          animation="wave" 
        />
        
        {/* Description placeholder */}
        <SkeletonText 
          lines={2} 
          className="mb-4" 
          animation="wave" 
        />
        
        {/* Price section */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton 
            variant="text" 
            width={70} 
            height={24}
            animation="wave" 
          />
          <Skeleton 
            variant="text" 
            width={50} 
            height={16}
            animation="wave" 
          />
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton 
            variant="rectangular" 
            height={36} 
            className="rounded-md" 
            animation="wave" 
          />
          <Skeleton 
            variant="rectangular" 
            height={36} 
            className="rounded-md" 
            animation="wave" 
          />
        </div>
      </div>
    </div>
  );

  if (count === 1) return singleCard;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, index) => (
        <React.Fragment key={index}>
          {singleCard}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SkeletonCard; 