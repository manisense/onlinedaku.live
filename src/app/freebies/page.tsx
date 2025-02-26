"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';
import { useLoading } from '@/context/LoadingContext';

const freebies = [
  {
    id: 1,
    title: 'Free Amazon Prime Trial',
    description: 'Get 30 days of Prime membership with unlimited streaming and free shipping',
    provider: 'Amazon',
    category: 'Subscription',
    expiryDate: '2024-03-31',
    image: '/globe.svg',
    requirements: 'New customers only',
    claimUrl: '#'
  },
  {
    id: 2,
    title: 'Free Web Development Course',
    description: 'Complete web development bootcamp with certification',
    provider: 'Udemy',
    category: 'Education',
    expiryDate: '2024-03-15',
    image: '/window.svg',
    requirements: 'Limited time offer',
    claimUrl: '#'
  },
  {
    id: 3,
    title: 'Free Spotify Premium',
    description: '3 months of free Spotify Premium subscription',
    provider: 'Spotify',
    category: 'Entertainment',
    expiryDate: '2024-02-28',
    image: '/headphones.jpg',
    requirements: 'New Premium users only',
    claimUrl: '#'
  },
  {
    id: 4,
    title: 'Free eBook Bundle',
    description: 'Download 5 bestselling eBooks for free',
    provider: 'Kindle Store',
    category: 'Books',
    expiryDate: '2024-03-20',
    image: '/file.svg',
    requirements: 'Kindle app required',
    claimUrl: '#'
  }
];

const categories = ['All', 'Subscription', 'Education', 'Entertainment', 'Books', 'Software', 'Gaming'];

export default function FreebiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // Simulate loading for demonstration
    showLoader('Finding free stuff for you...');
    
    // Simulate API call
    const timer = setTimeout(() => {
      hideLoader();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [showLoader, hideLoader]);

  const filteredFreebies = freebies.filter(freebie =>
    selectedCategory === 'All' ? true : freebie.category === selectedCategory
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Freebies</h1>

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
            <option value="expiring">Expiring Soon</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Freebies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreebies.map(freebie => (
            <div key={freebie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={freebie.image}
                  alt={freebie.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  FREE
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{freebie.title}</h3>
                    <p className="text-sm text-gray-500">{freebie.provider}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {freebie.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{freebie.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>Requirements: {freebie.requirements}</p>
                  <p className="mt-2">Expires: {new Date(freebie.expiryDate).toLocaleDateString()}</p>
                </div>
                <a
                  href={freebie.claimUrl}
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Claim Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </MainLayout>
  );
}