import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonCarouselProps {
  itemCount?: number;
  className?: string;
  showControls?: boolean;
  itemWidth?: number;
  itemHeight?: number;
}

const SkeletonCarousel: React.FC<SkeletonCarouselProps> = ({
  itemCount = 5,
  className = '',
  showControls = true,
  itemWidth = 280,
  itemHeight = 200
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Carousel Header */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton 
          variant="text" 
          width="30%" 
          height={24} 
          className="mb-1" 
          animation="wave" 
        />
        
        {showControls && (
          <div className="flex space-x-2">
            <Skeleton 
              variant="circular" 
              width={36} 
              height={36} 
              animation="wave" 
            />
            <Skeleton 
              variant="circular" 
              width={36} 
              height={36} 
              animation="wave" 
            />
          </div>
        )}
      </div>
      
      {/* Carousel Items */}
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 overflow-x-hidden">
          {Array.from({ length: itemCount }).map((_, index) => (
            <div 
              key={index} 
              className="flex-none"
              style={{ width: itemWidth, height: itemHeight }}
            >
              <div className="bg-white rounded-lg shadow-sm p-3 h-full">
                {/* Image placeholder */}
                <Skeleton 
                  variant="rectangular" 
                  height={itemHeight * 0.6} 
                  className="rounded-md mb-3" 
                  animation="wave" 
                />
                
                {/* Title placeholder */}
                <Skeleton 
                  variant="text" 
                  width="80%" 
                  className="mb-2" 
                  animation="wave" 
                />
                
                {/* Description placeholder */}
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={12}
                  animation="wave" 
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays to indicate more content */}
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-gray-900 pointer-events-none"></div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-1">
        {Array.from({ length: Math.min(5, itemCount) }).map((_, index) => (
          <Skeleton 
            key={index}
            variant="circular" 
            width={8} 
            height={8} 
            className={index === 0 ? "bg-indigo-400" : ""}
            animation={index === 0 ? "none" : "wave"} 
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCarousel; 