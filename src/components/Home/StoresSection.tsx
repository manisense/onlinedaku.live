'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import SkeletonStoreCard from '../ui/SkeletonStoreCard';

interface Store {
  _id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
  createdAt?: string;
}

const StoreCard: React.FC<Store> = ({ name, logo,  description }) => {
  const storeSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return (
    <Link href={`/stores/${storeSlug}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <div className="relative h-28">
          <Image
            src={logo || '/product-placeholder.png'}
            alt={name}
            fill
            unoptimized={true}
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/product-placeholder.png';
            }}
          />
        </div>
        <div className="p-2">
          <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1 truncate">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

const StoresSection: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stores?limit=8&isActive=true');
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        const data = await response.json();
        setStores(data.data || []);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores');
      } finally {
        // Add a small delay to show the skeleton for a moment
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchStores();
  }, []);

  return (
    <section className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Featured Stores</h2>
          <Link href="/stores" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
            View All <FaArrowRight className="ml-1 w-3 h-3" />
          </Link>
        </div>
        
        {loading ? (
          <SkeletonStoreCard count={8} />
        ) : error ? (
          <div className="w-full text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stores.map((store) => (
              <StoreCard
                key={store._id}
                {...store}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoresSection;