import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonBannerCarouselProps {
  className?: string;
  height?: number | string;
}

const SkeletonBannerCarousel: React.FC<SkeletonBannerCarouselProps> = ({
  className = '',
  height = 400
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Main Banner */}
        <div className="relative rounded-lg overflow-hidden">
          <Skeleton 
            variant="rectangular" 
            height={height} 
            className="w-full" 
            animation="wave" 
          />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <div className="max-w-lg">
              <Skeleton 
                variant="text" 
                width="70%" 
                height={32} 
                className="mb-3" 
                animation="wave" 
              />
              
              <Skeleton 
                variant="text" 
                width="90%" 
                height={16} 
                className="mb-2" 
                animation="wave" 
              />
              
              <Skeleton 
                variant="text" 
                width="60%" 
                height={16} 
                className="mb-4" 
                animation="wave" 
              />
              
              <div className="flex space-x-3">
                <Skeleton 
                  variant="rectangular" 
                  width={120} 
                  height={40} 
                  className="rounded-md" 
                  animation="wave" 
                />
                
                <Skeleton 
                  variant="rectangular" 
                  width={120} 
                  height={40} 
                  className="rounded-md" 
                  animation="wave" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Skeleton 
            variant="circular" 
            width={48} 
            height={48} 
            animation="wave" 
          />
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Skeleton 
            variant="circular" 
            width={48} 
            height={48} 
            animation="wave" 
          />
        </div>
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton 
            key={index}
            variant="rectangular" 
            width={24} 
            height={4} 
            className={`rounded-full ${index === 0 ? "bg-indigo-500" : ""}`}
            animation={index === 0 ? "none" : "wave"} 
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonBannerCarousel; 