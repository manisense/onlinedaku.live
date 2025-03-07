import React from 'react';
import SkeletonBannerCarousel from './SkeletonBannerCarousel';
import SkeletonCard from './SkeletonCard';
import SkeletonStoreCard from './SkeletonStoreCard';

const HomePageSkeleton: React.FC = () => {
  return (
    <>
      {/* Banner Carousel */}
      <SkeletonBannerCarousel height={400} />
      
      {/* Main Sections */}
      <div className="sections bg-white my-5 py-5 space-y-12">
        {/* Deals Section */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <SkeletonCard count={8} />
          </div>
        </section>
        
        {/* Coupons Section */}
        <section className="py-4 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <SkeletonCard count={8} />
          </div>
        </section>
        
        {/* Freebies Section */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <SkeletonCard count={8} />
          </div>
        </section>
        
        {/* Stores Section */}
        <section className="py-4 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <SkeletonStoreCard count={8} />
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePageSkeleton; 