'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SkeletonBannerCarousel from '../ui/SkeletonBannerCarousel';

interface Banner {
  _id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}

const BannerCarousel: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/banners');
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        setBanners(data.banners || []);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError('Failed to load banners');
      } finally {
        // Add a small delay to show the skeleton for a moment
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchBanners();
  }, []);

  // Auto scroll functionality
  useEffect(() => {
    if (!isHovered && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex >= banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }

  }, [banners.length, isHovered]);


  const handleImageError = (bannerId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [bannerId]: true
    }));
  };

  if (loading) {
    return <SkeletonBannerCarousel height={400} />;
  }

  if (error || banners.length === 0) {
    return null; 
  }

  return (
    <div 
      className="relative p-3 max-w-screen-xl  mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative  md:min-h-[500px] min-h-[200px] min-w-max rounded-lg">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={imageErrors[banner._id] ? '/banner-placeholder.png' : banner.image}
              alt={banner.title}
              fill
              priority={index === currentIndex}
              unoptimized={true}
              className="object-contain h-max"
             
              onError={() => handleImageError(banner._id)}
              loading={index === currentIndex ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-transparent" />
       
          </div>
        ))}

        {/* Navigation Arrows */}
        {/* {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
              aria-label="Previous slide"
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
              aria-label="Next slide"
            >
              <FaChevronRight size={20} />
            </button>
          </>
        )} */}
      </div>

      {/* Pagination Indicators */}
      {banners.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-6 h-1 rounded-full transition-colors ${
                index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;