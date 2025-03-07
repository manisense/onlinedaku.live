import React from 'react';
import SkeletonCouponCard from './SkeletonCouponCard';
import Skeleton from './Skeleton';

interface SkeletonCouponGridProps {
  count?: number;
  className?: string;
  showHeader?: boolean;
}

const SkeletonCouponGrid: React.FC<SkeletonCouponGridProps> = ({
  count = 8,
  className = '',
  showHeader = true
}) => {
  return (
    <div className={`w-full ${className}`}>
      {showHeader && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton 
              variant="text" 
              width="30%" 
              height={28} 
              className="mb-1" 
              animation="wave" 
            />
            
            <Skeleton 
              variant="text" 
              width={100} 
              height={20} 
              animation="wave" 
            />
          </div>
          
          {/* Filter Pills */}
          <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton 
                key={index}
                variant="rectangular" 
                width={100} 
                height={32} 
                className="rounded-full flex-shrink-0" 
                animation="wave" 
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCouponCard key={index} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton 
              key={index}
              variant="rectangular" 
              width={40} 
              height={40} 
              className="rounded-md" 
              animation="wave" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCouponGrid; 