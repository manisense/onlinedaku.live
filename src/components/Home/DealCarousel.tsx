'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Loader from '../ui/Loader';

interface Deal {
  _id: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  discountValue: number;
  store: string;
  link: string;
}

const DealCarousel: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/deals?sortBy=discount');
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        const data = await response.json();
        setDeals(data.deals.slice(0, 9)); // Get top 9 deals
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Auto scroll functionality
  useEffect(() => {
    if (!isHovered && deals.length > 3) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex >= deals.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, deals.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= deals.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? deals.length - 3 : prevIndex - 1
    );
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-50 py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Deals</h2>
        
        <div className="relative">
          {loading ? (
            <div className="w-full flex justify-center items-center py-8">
              <Loader size="large" text="Finding deals for you..." />
            </div>
          ) : error ? (
            <div className="w-full text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / 3}%)`,
                }}
              >
                {deals.map((deal, index) => (
                  <div
                    key={deal._id}
                    className="px-2 w-48 sm:px-3 md:px-4"
                    style={{ flex: `0 0 ${100 / 3}%` }}
                  >
                    <Link href={`/deals/${deal._id}`}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                        <div className="relative h-48">
                          <Image
                            src={deal.image}
                            alt={deal.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-contain"
                            priority
                            onError={(e) => {
                              e.currentTarget.src = '/product-placeholder.png';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                            {deal.discountValue}% OFF
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-l font-semibold text-gray-900 mb-3 truncate">
                            {deal.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-xl font-bold text-gray-900">
                                {formatCurrency(deal.price)}
                              </span>
                              <span className="text-base text-gray-500 line-through">
                                {formatCurrency(deal.originalPrice)}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-lg font-medium text-gray-600">{deal.store}</span>
                              <span className="text-sm text-green-600">View Deal →</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {deals.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-3 pt-1 mt-3">
            {deals.length > 3 && deals.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex || 
                  (currentIndex > index && index > currentIndex - 3) || 
                  (currentIndex + 3 > deals.length && index < (currentIndex + 3) % deals.length)
                    ? 'bg-indigo-600 w-4' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCarousel;