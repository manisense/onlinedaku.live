import React from 'react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

interface SkeletonFeaturedCarouselProps {
  className?: string;
  itemCount?: number;
}

const SkeletonFeaturedCarousel: React.FC<SkeletonFeaturedCarouselProps> = ({
  className = '',
  itemCount = 3
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Section Title */}
      <div className="mb-6">
        <Skeleton 
          variant="text" 
          width="40%" 
          height={28} 
          className="mb-2" 
          animation="wave" 
        />
        <Skeleton 
          variant="text" 
          width="70%" 
          height={16} 
          animation="wave" 
        />
      </div>
      
      {/* Featured Carousel */}
      <div className="relative">
        {/* Navigation Indicators */}
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            animation="wave" 
          />
        </div>
        
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            animation="wave" 
          />
        </div>
        
        {/* Carousel Items */}
        <div className="flex space-x-6 overflow-hidden px-4">
          {Array.from({ length: itemCount }).map((_, index) => (
            <div key={index} className="flex-none w-full md:w-1/2 lg:w-1/3 p-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
                {/* Image */}
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  className="w-full" 
                  animation="wave" 
                />
                
                {/* Content */}
                <div className="p-4">
                  {/* Badge */}
                  <div className="mb-3">
                    <Skeleton 
                      variant="rectangular" 
                      width={80} 
                      height={24} 
                      className="rounded-full" 
                      animation="wave" 
                    />
                  </div>
                  
                  {/* Title */}
                  <Skeleton 
                    variant="text" 
                    width="90%" 
                    height={24} 
                    className="mb-2" 
                    animation="wave" 
                  />
                  
                  {/* Description */}
                  <SkeletonText 
                    lines={2} 
                    className="mb-4" 
                    animation="wave" 
                  />
                  
                  {/* Price and CTA */}
                  <div className="flex justify-between items-center">
                    <Skeleton 
                      variant="text" 
                      width={80} 
                      height={28} 
                      animation="wave" 
                    />
                    
                    <Skeleton 
                      variant="rectangular" 
                      width={100} 
                      height={36} 
                      className="rounded-md" 
                      animation="wave" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.min(5, itemCount) }).map((_, index) => (
          <Skeleton 
            key={index}
            variant="circular" 
            width={10} 
            height={10} 
            className={index === 0 ? "bg-indigo-500" : ""}
            animation={index === 0 ? "none" : "wave"} 
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonFeaturedCarousel; 