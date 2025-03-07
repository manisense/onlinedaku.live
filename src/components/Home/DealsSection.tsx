'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import SkeletonCard from '../ui/SkeletonCard';

interface Deal {
  _id: string;
  title: string;
  image: string;
  store: string;
  discount: number;
  link: string;
  createdAt: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  } | string;
}

const DealsCard: React.FC<Deal> = ({ title, image, store, discount, _id }) => {
  const imageSrc = image || '/product-placeholder.png';
  const link = _id || '#';
  
  return (
    <Link href={`/deals/${link}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <div className="relative h-28">
          <Image
            src={imageSrc}
            alt={title || 'Deal Image'}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = '/product-placeholder.png';
            }}
          />
          {discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title || 'Untitled Deal'}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-600">{store || 'Unknown Store'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const DealsSection: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/deals?limit=8&sort=createdAt:desc');
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        const data = await response.json();
        setDeals(data.deals || []);
      } catch (err) {
        console.error('Error fetching deals:', err);
        // Fallback to sample data if API fails
        setDeals([
          {
            _id: '1',
            title: 'Amazon Fashion Sale',
            image: '/images/products/amazon-fashion.jpg',
            store: 'Amazon',
            discount: 40,
            link: '/deals/1',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            title: 'Flipkart Electronics',
            image: '/images/products/flipkart-electronics.jpg',
            store: 'Flipkart',
            discount: 25,
            link: '/deals/2',
            createdAt: new Date().toISOString()
          },
          {
            _id: '3',
            title: 'Myntra Clothing',
            image: '/images/products/myntra-clothing.jpg',
            store: 'Myntra',
            discount: 30,
            link: '/deals/3',
            createdAt: new Date().toISOString()
          },
          {
            _id: '4',
            title: 'Ajio Fashion',
            image: '/images/products/ajio-fashion.jpg',
            store: 'Ajio',
            discount: 35,
            link: '/deals/4',
            createdAt: new Date().toISOString()
          },
          {
            _id: '5',
            title: 'Tata CLiQ Sale',
            image: '/images/products/tata-cliq.jpg',
            store: 'Tata CLiQ',
            discount: 20,
            link: '/deals/5',
            createdAt: new Date().toISOString()
          },
          {
            _id: '6',
            title: 'Nykaa Beauty',
            image: '/images/products/nykaa-beauty.jpg',
            store: 'Nykaa',
            discount: 15,
            link: '/deals/6',
            createdAt: new Date().toISOString()
          },
          {
            _id: '7',
            title: 'Swiggy Food',
            image: '/images/products/swiggy-food.jpg',
            store: 'Swiggy',
            discount: 50,
            link: '/deals/7',
            createdAt: new Date().toISOString()
          },
          {
            _id: '8',
            title: 'Zomato Dining',
            image: '/images/products/zomato-dining.jpg',
            store: 'Zomato',
            discount: 45,
            link: '/deals/8',
            createdAt: new Date().toISOString()
          }
        ]);
      } finally {
        // Add a small delay to show the skeleton for a moment
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchDeals();
  }, []);

  return (
    <section className="bg-white min-h-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Latest Deals</h2>
          <Link href="/deals" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
            View All <FaArrowRight className="ml-1 w-3 h-3" />
          </Link>
        </div>
        
        {loading ? (
          <SkeletonCard count={8} />
        ) : error ? (
          <div className="w-full text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.map((deal) => (
              <DealsCard
                key={deal._id}
                {...deal}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsSection;