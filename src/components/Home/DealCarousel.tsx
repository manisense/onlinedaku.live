'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Deal {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  store: string;
}

const sampleDeals: Deal[] = [
  {
    id: '1',
    title: 'MacBook Pro M2',
    image: '/macbook-pro.jpg',
    price: 129900,
    originalPrice: 149900,
    discountPercentage: 13,
    store: 'Amazon'
  },
  {
    id: '2',
    title: 'Sony WH-1000XM4',
    image: '/headphones.jpg',
    price: 19990,
    originalPrice: 29990,
    discountPercentage: 33,
    store: 'Flipkart'
  },
  // Add more sample deals as needed
];

const DealCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto scroll functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === sampleDeals.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sampleDeals.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sampleDeals.length - 1 : prevIndex - 1
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Deals</h2>
        
        <div className="relative">
          <div className="flex transition-transform duration-500 ease-in-out"
               style={{
                 transform: `translateX(-${currentIndex * 100}%)`,
               }}>
            {sampleDeals.map((deal) => (
              <div
                key={deal.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-2"
              >
                <Link href={`/deals/${deal.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        {deal.discountPercentage}% OFF
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                        {deal.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(deal.price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatCurrency(deal.originalPrice)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{deal.store}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
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

          {/* Dots Indicator */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 pb-4">
            {sampleDeals.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-indigo-600 w-4' : 'bg-gray-300'
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