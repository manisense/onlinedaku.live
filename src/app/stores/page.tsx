"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';
import Loader from '@/components/ui/Loader';

interface Store {
  _id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
  createdAt?: string;
  slug: string;
  rating?: number;
  activeDeals?: number;
  featured?: boolean;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setLoading(true);
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        
        const data = await response.json();
        setStores(data.data || []);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <MainLayout>
      <SearchBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-6">
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

          {isLoading ? (
            <div className="text-center py-12">
              <Loader size='large' text='Loading...' />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map(store => (
                <div key={store._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-40 bg-gray-100 p-6 flex items-center justify-center">
                    <Image
                      src={store.logo || '/product-placeholder.png'}
                      alt={store.name}
                      width={120}
                      height={120}
                      style={{ objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.src = '/product-placeholder.png';
                      }}
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
                      </div>
                      {store.rating && (
                        <div className="flex items-center bg-indigo-100 px-2 py-1 rounded-full">
                          <span className="text-indigo-600 font-medium text-sm">{store.rating} ★</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{store.description}</p>
                    {store.activeDeals !== undefined && (
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">{store.activeDeals} Active Deals</span>
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <a
                        href={`/stores/${store.slug}`}
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
          )}
        </div>
      </div>
    </MainLayout>
  );
}