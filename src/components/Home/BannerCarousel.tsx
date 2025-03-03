'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Loader from '../ui/Loader';

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
        setLoading(false);
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
      }, 5000); // Increased interval for banner slides
      return () => clearInterval(interval);
    }
  }, [isHovered, banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto">
        <div className="relative">
          {loading ? (
            <div className="w-full flex justify-center items-center py-8">
              <Loader size="large" text="Loading banners..." />
            </div>
          ) : error ? (
            <div className="w-full text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="w-full flex-shrink-0"
                  >
                    <Link href={banner.link}>
                      <div className="relative aspect-[21/9] w-full">
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          priority
                          onError={(e) => {
                            e.currentTarget.src = '/banner-placeholder.png';
                          }}
                          unoptimized
                        />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {banners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
            {banners.length > 1 && banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-indigo-600 w-4'
                    : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;