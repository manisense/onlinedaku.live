import React from 'react';
import SkeletonText from './SkeletonText';
import Skeleton from './Skeleton';

interface PageSkeletonProps {
  type?: 'product' | 'blog' | 'general';
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ type = 'general' }) => {
  if (type === 'product') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Skeleton 
              variant="rectangular" 
              height={300} 
              className="rounded-md" 
              animation="wave" 
            />
            
            {/* Thumbnails */}
            <div className="flex mt-4 space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton 
                  key={i}
                  variant="rectangular" 
                  width={60} 
                  height={60} 
                  className="rounded-md" 
                  animation="wave" 
                />
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <Skeleton variant="text" width="70%" height={32} className="mb-4" animation="wave" />
            <Skeleton variant="text" width="40%" height={24} className="mb-6" animation="wave" />
            
            <SkeletonText lines={4} className="mb-6" />
            
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" animation="wave" />
              <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" animation="wave" />
            </div>
            
            <SkeletonText lines={3} />
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <Skeleton variant="text" width="30%" height={24} className="mb-6" animation="wave" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <Skeleton variant="rectangular" height={150} className="rounded-md mb-2" animation="wave" />
                <Skeleton variant="text" width="80%" className="mb-2" animation="wave" />
                <Skeleton variant="text" width="40%" animation="wave" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'blog') {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Skeleton variant="text" width="60%" height={40} className="mx-auto mb-4" animation="wave" />
          <Skeleton variant="text" width="40%" height={24} className="mx-auto mb-6" animation="wave" />
          <div className="flex justify-center items-center space-x-4">
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <Skeleton variant="text" width={100} animation="wave" />
          </div>
        </div>
        
        {/* Featured Image */}
        <Skeleton 
          variant="rectangular" 
          height={400} 
          className="rounded-lg mb-8" 
          animation="wave" 
        />
        
        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <SkeletonText lines={12} className="mb-8" />
          
          <Skeleton 
            variant="rectangular" 
            height={300} 
            className="rounded-lg my-8" 
            animation="wave" 
          />
          
          <SkeletonText lines={8} />
        </div>
      </div>
    );
  }
  
  // General page skeleton
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton variant="text" width="40%" height={32} className="mb-4" animation="wave" />
        <Skeleton variant="text" width="70%" height={20} className="mb-8" animation="wave" />
      </div>
      
      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <Skeleton 
            variant="rectangular" 
            height={250} 
            className="rounded-lg mb-4" 
            animation="wave" 
          />
          <SkeletonText lines={6} className="mb-6" />
        </div>
        
        <div>
          <Skeleton 
            variant="rectangular" 
            height={150} 
            className="rounded-lg mb-4" 
            animation="wave" 
          />
          <SkeletonText lines={4} />
        </div>
      </div>
      
      {/* Card Grid */}
      <Skeleton variant="text" width="30%" height={24} className="mb-6" animation="wave" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
            <Skeleton variant="rectangular" height={180} className="rounded-md mb-4" animation="wave" />
            <Skeleton variant="text" width="80%" className="mb-2" animation="wave" />
            <SkeletonText lines={2} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton; 