import React from 'react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

interface SkeletonCouponCardProps {
  className?: string;
  showStore?: boolean;
}

const SkeletonCouponCard: React.FC<SkeletonCouponCardProps> = ({
  className = '',
  showStore = true
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 ${className}`}>
      {/* Featured Ribbon */}
      <div className="py-1 px-3 text-center bg-gray-200 animate-pulse">
        <div className="h-4 w-24 mx-auto"></div>
      </div>
      
      {/* Store Header */}
      {showStore && (
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton 
              variant="rectangular" 
              width={48} 
              height={48} 
              className="rounded-md mr-4" 
              animation="wave" 
            />
            
            <div>
              <Skeleton 
                variant="text" 
                width={100} 
                className="mb-1" 
                animation="wave" 
              />
              <Skeleton 
                variant="text" 
                width={80} 
                height={12} 
                animation="wave" 
              />
            </div>
          </div>
          
          <Skeleton 
            variant="rectangular" 
            width={60} 
            height={24} 
            className="rounded-full" 
            animation="wave" 
          />
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-4">
        {/* Discount Badge */}
        <div className="mb-3">
          <Skeleton 
            variant="rectangular" 
            width={80} 
            height={24} 
            className="rounded-full" 
            animation="wave" 
          />
        </div>
        
        {/* Title and Description */}
        <Skeleton 
          variant="text" 
          width="90%" 
          height={24} 
          className="mb-2" 
          animation="wave" 
        />
        
        <SkeletonText 
          lines={2} 
          className="mb-4" 
          animation="wave" 
        />
        
        {/* Coupon Code */}
        <div className="flex items-center justify-between p-3 mb-4 bg-gray-50 border border-dashed border-gray-300 rounded-md">
          <Skeleton 
            variant="text" 
            width={120} 
            animation="wave" 
          />
          
          <Skeleton 
            variant="text" 
            width={60} 
            animation="wave" 
          />
        </div>
        
        {/* Action Button */}
        <Skeleton 
          variant="rectangular" 
          height={44} 
          className="rounded-md mb-3" 
          animation="wave" 
        />
        
        {/* Rating */}
        <div className="mt-3 flex justify-center">
          <Skeleton 
            variant="text" 
            width={100} 
            height={16} 
            className="mx-auto" 
            animation="wave" 
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2.5 bg-gray-50 flex justify-between items-center border-t border-gray-100">
        <Skeleton 
          variant="text" 
          width={80} 
          height={16} 
          animation="wave" 
        />
        
        <Skeleton 
          variant="text" 
          width={120} 
          height={16} 
          animation="wave" 
        />
      </div>
    </div>
  );
};

export default SkeletonCouponCard; 