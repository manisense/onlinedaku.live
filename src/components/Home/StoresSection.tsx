'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import Loader from '../ui/Loader';

interface Store {
  _id: string;
  title: string;
  image: string;
  link: string;
}

const StoreCard: React.FC<Store> = ({ title, image, link }) => {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <div className="relative h-28">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = '/product-placeholder.png';
            }}
          />
        </div>
        <div className="p-2">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

const StoresSection: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stores?limit=8');
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        const data = await response.json();
        setStores(data.stores || []);
      } catch (err) {
        console.error('Error fetching stores:', err);
        //setError('Failed to load stores');
        // Fallback to sample data if API fails
        setStores([
          {
            _id: '1',
            title: 'Amazon India',
            image: '/images/stores/amazon.jpg',
            link: '/stores/amazon'
          },
          {
            _id: '2',
            title: 'Flipkart',
            image: '/images/stores/flipkart.jpg',
            link: '/stores/flipkart'
          },
          {
            _id: '3',
            title: 'Myntra',
            image: '/images/stores/myntra.jpg',
            link: '/stores/myntra'
          },
          {
            _id: '4',
            title: 'Ajio',
            image: '/images/stores/ajio.jpg',
            link: '/stores/ajio'
          },
          {
            _id: '5',
            title: 'Tata CLiQ',
            image: '/images/stores/tata-cliq.jpg',
            link: '/stores/tata-cliq'
          },
          {
            _id: '6',
            title: 'Nykaa',
            image: '/images/stores/nykaa.jpg',
            link: '/stores/nykaa'
          },
          {
            _id: '7',
            title: 'Swiggy',
            image: '/images/stores/swiggy.jpg',
            link: '/stores/swiggy'
          },
          {
            _id: '8',
            title: 'Zomato',
            image: '/images/stores/zomato.jpg',
            link: '/stores/zomato'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <section className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Popular Stores</h2>
          <Link href="/stores" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
            View All <FaArrowRight className="ml-1 w-3 h-3" />
          </Link>
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center items-center py-8">
            <Loader size="medium" text="Loading stores..." />
          </div>
        ) : error ? (
          <div className="w-full text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stores.slice(0, 8).map((store) => (
              <StoreCard
                key={store._id}
                _id={store._id}
                title={store.title}
                image={store.image}
                link={store.link}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoresSection;