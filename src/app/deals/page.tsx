"use client"

import { useState } from 'react';
import Image from 'next/image';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';

const deals = [
  {
    id: 1,
    title: 'MacBook Pro M2 - $200 Off',
    description: 'Latest MacBook Pro with M2 chip at an incredible discount',
    store: 'Apple Store',
    discount: '15%',
    price: '$1299',
    originalPrice: '$1499',
    expiryDate: '2024-02-28',
    category: 'Electronics',
    image: '/macbook-pro.jpg'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Premium noise-cancelling headphones with exceptional sound quality',
    store: 'Best Buy',
    discount: '25%',
    price: '$249',
    originalPrice: '$349',
    expiryDate: '2024-02-25',
    category: 'Electronics',
    image: '/headphones.jpg'
  },
  // Add more dummy deals here
];

const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Books', 'Gaming', 'Travel'];

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredDeals = deals.filter(deal =>
    selectedCategory === 'All' ? true : deal.category === selectedCategory
  );

  return (
    <MainLayout>
         <div className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hot Deals</h1>
        
        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full sm:w-auto px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="discount">Highest Discount</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map(deal => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {deal.discount} OFF
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{deal.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{deal.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{deal.originalPrice}</span>
                  </div>
                  <span className="text-sm text-gray-500">{deal.store}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Expires: {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(deal.expiryDate))}</span>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300">
                    Get Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </MainLayout>
  );
}