import React from 'react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

const DealsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Skeleton 
              variant="rectangular" 
              height={48} 
              className="rounded-md" 
              animation="wave" 
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Category Filter Skeleton */}
          <div className="md:w-1/4 lg:w-1/5">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <Skeleton 
                variant="text" 
                width="60%" 
                height={24} 
                className="mb-4" 
                animation="wave" 
              />
              
              {/* Category items */}
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton 
                      variant="rectangular" 
                      width={20} 
                      height={20} 
                      className="rounded-sm mr-2" 
                      animation="wave" 
                    />
                    <Skeleton 
                      variant="text" 
                      width="70%" 
                      animation="wave" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Deals Grid Skeleton */}
          <div className="md:w-3/4 lg:w-4/5">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                    {/* Product Image */}
                    <Skeleton 
                      variant="rectangular" 
                      height={180} 
                      className="rounded-md mb-4" 
                      animation="wave" 
                    />
                    
                    {/* Product Title */}
                    <Skeleton 
                      variant="text" 
                      width="90%" 
                      className="mb-2" 
                      animation="wave" 
                    />
                    
                    {/* Product Description */}
                    <SkeletonText 
                      lines={2} 
                      width="100%" 
                      className="mb-4" 
                      animation="wave" 
                    />
                    
                    {/* Price and Discount */}
                    <div className="flex justify-between items-center">
                      <Skeleton 
                        variant="text" 
                        width="40%" 
                        animation="wave" 
                      />
                      <Skeleton 
                        variant="rectangular" 
                        width={60} 
                        height={24} 
                        className="rounded-full" 
                        animation="wave" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsPageSkeleton; 