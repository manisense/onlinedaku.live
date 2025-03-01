'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import Loader from '../ui/Loader';

interface Coupon {
  _id: string;
  title: string;
  image: string;
  store: string;
  discount: number;
  link: string;
}

const CouponCard: React.FC<Coupon> = ({ title, image, store, discount, link }) => {
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
          {discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-600">{store}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CouponsSection: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/coupons?limit=8');
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        const data = await response.json();
        setCoupons(data.coupons || []);
      } catch (err) {
        console.error('Error fetching coupons:', err);
       // setError('Failed to load coupons');
        // Fallback to sample data if API fails
        setCoupons([
          {
            _id: '1',
            title: 'Amazon Fashion Sale',
            image: '/images/products/amazon-fashion.jpg',
            store: 'Amazon',
            discount: 40,
            link: '/coupons/1'
          },
          {
            _id: '2',
            title: 'Flipkart Electronics',
            image: '/images/products/flipkart-electronics.jpg',
            store: 'Flipkart',
            discount: 25,
            link: '/coupons/2'
          },
          {
            _id: '3',
            title: 'Myntra Clothing',
            image: '/images/products/myntra-clothing.jpg',
            store: 'Myntra',
            discount: 30,
            link: '/coupons/3'
          },
          {
            _id: '4',
            title: 'Ajio Fashion',
            image: '/images/products/ajio-fashion.jpg',
            store: 'Ajio',
            discount: 35,
            link: '/coupons/4'
          },
          {
            _id: '5',
            title: 'Tata CLiQ Sale',
            image: '/images/products/tata-cliq.jpg',
            store: 'Tata CLiQ',
            discount: 20,
            link: '/coupons/5'
          },
          {
            _id: '6',
            title: 'Nykaa Beauty',
            image: '/images/products/nykaa-beauty.jpg',
            store: 'Nykaa',
            discount: 15,
            link: '/coupons/6'
          },
          {
            _id: '7',
            title: 'Swiggy Food',
            image: '/images/products/swiggy-food.jpg',
            store: 'Swiggy',
            discount: 50,
            link: '/coupons/7'
          },
          {
            _id: '8',
            title: 'Zomato Dining',
            image: '/images/products/zomato-dining.jpg',
            store: 'Zomato',
            discount: 45,
            link: '/coupons/8'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <section className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Latest Coupons</h2>
          <Link href="/coupons" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
            View All <FaArrowRight className="ml-1 w-3 h-3" />
          </Link>
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center items-center py-8">
            <Loader size="medium" text="Loading coupons..." />
          </div>
        ) : error ? (
          <div className="w-full text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {coupons.slice(0, 8).map((coupon) => (
              <CouponCard
                key={coupon._id}
                _id={coupon._id}
                title={coupon.title}
                image={coupon.image}
                store={coupon.store}
                discount={coupon.discount}
                link={coupon.link}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CouponsSection;