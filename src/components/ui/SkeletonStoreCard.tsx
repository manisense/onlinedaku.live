import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonStoreCardProps {
  count?: number;
  className?: string;
}

const SkeletonStoreCard: React.FC<SkeletonStoreCardProps> = ({ count = 1, className = '' }) => {
  const singleCard = (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-sm transition-shadow duration-300 h-full ${className}`}>
      {/* Logo placeholder */}
      <div className="relative h-28">
        <Skeleton 
          variant="rectangular" 
          height="100%" 
          className="w-full" 
          animation="wave" 
        />
      </div>
      
      <div className="p-2">
        {/* Store name placeholder */}
        <Skeleton 
          variant="text" 
          width="70%" 
          height={16}
          className="mb-2" 
          animation="wave" 
        />
        
        {/* Description placeholder */}
        <Skeleton 
          variant="text" 
          width="90%" 
          height={12}
          className="mb-1" 
          animation="wave" 
        />
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

export default SkeletonStoreCard; 