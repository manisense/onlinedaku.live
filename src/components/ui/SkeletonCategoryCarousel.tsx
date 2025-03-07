import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonCategoryCarouselProps {
  className?: string;
  itemCount?: number;
}

const SkeletonCategoryCarousel: React.FC<SkeletonCategoryCarouselProps> = ({
  className = '',
  itemCount = 8
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Section Title */}
      <div className="mb-4">
        <Skeleton 
          variant="text" 
          width="25%" 
          height={24} 
          className="mb-1" 
          animation="wave" 
        />
      </div>
      
      {/* Category Pills */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-hidden py-2">
          {Array.from({ length: itemCount }).map((_, index) => (
            <div key={index} className="flex-none">
              <div className="flex flex-col items-center space-y-2">
                {/* Category Icon */}
                <Skeleton 
                  variant="circular" 
                  width={64} 
                  height={64} 
                  animation="wave" 
                />
                
                {/* Category Name */}
                <Skeleton 
                  variant="text" 
                  width={80} 
                  height={16} 
                  animation="wave" 
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays to indicate more content */}
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-gray-900 pointer-events-none"></div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="flex justify-center mt-3">
        <Skeleton 
          variant="rectangular" 
          width={40} 
          height={4} 
          className="rounded-full" 
          animation="wave" 
        />
      </div>
    </div>
  );
};

export default SkeletonCategoryCarousel; 