"use client"

import { useState } from 'react';
import Image from 'next/image';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';

const stores = [
  {
    id: 1,
    name: 'Amazon',
    logo: '/globe.svg',
    category: 'Multi-Category',
    description: 'World\'s largest online retailer with millions of products',
    activeDeals: 245,
    rating: 4.8,
    featured: true,
    website: 'https://amazon.com'
  },
  {
    id: 2,
    name: 'Best Buy',
    logo: '/window.svg',
    category: 'Electronics',
    description: 'Leading electronics and technology products retailer',
    activeDeals: 156,
    rating: 4.6,
    featured: true,
    website: 'https://bestbuy.com'
  },
  {
    id: 3,
    name: 'Fashion Nova',
    logo: '/file.svg',
    category: 'Fashion',
    description: 'Trendy fashion and accessories for men and women',
    activeDeals: 89,
    rating: 4.5,
    featured: false,
    website: 'https://fashionnova.com'
  },
  {
    id: 4,
    name: 'Home Depot',
    logo: '/globe.svg',
    category: 'Home & Garden',
    description: 'Everything you need for home improvement and gardening',
    activeDeals: 134,
    rating: 4.7,
    featured: true,
    website: 'https://homedepot.com'
  },
  {
    id: 5,
    name: 'Booking.com',
    logo: '/window.svg',
    category: 'Travel',
    description: 'Book hotels, flights, and vacation packages',
    activeDeals: 67,
    rating: 4.4,
    featured: false,
    website: 'https://booking.com'
  },
  {
    id: 6,
    name: 'GameStop',
    logo: '/file.svg',
    category: 'Gaming',
    description: 'Video games, consoles, and gaming accessories',
    activeDeals: 92,
    rating: 4.3,
    featured: false,
    website: 'https://gamestop.com'
  }
];

const categories = ['All', 'Multi-Category', 'Electronics', 'Fashion', 'Home & Garden', 'Travel', 'Gaming'];

export default function StoresPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filteredStores = stores.filter(store =>
    selectedCategory === 'All' ? true : store.category === selectedCategory
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Featured Stores</h1>

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
            <option value="featured">Featured</option>
            <option value="deals">Most Deals</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
            <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-40 bg-gray-100 p-6 flex items-center justify-center">
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={120}
                  height={120}
                  style={{ objectFit: 'contain' }}
                />
                {store.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-500">{store.category}</p>
                  </div>
                  <div className="flex items-center bg-indigo-100 px-2 py-1 rounded-full">
                    <span className="text-indigo-600 font-medium text-sm">{store.rating} ★</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{store.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{store.activeDeals} Active Deals</span>
                </div>
                <div className="flex space-x-3">
                  <a
                    href={`/stores/${store.id}`}
                    className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    View Deals
                  </a>
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300"
                  >
                    Visit Store
                  </a>
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