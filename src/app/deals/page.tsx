"use client"

import { useState, useEffect } from 'react';
import { FaTag, FaStore, FaClock } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';

interface Deal {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  couponCode?: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data = await response.json();
      setDeals(data.deals);
    } catch (err) {
      console.error(err);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout>
      <div className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Deals</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal._id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{deal.title}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <FaStore className="mr-2" />
                  <span>{deal.store}</span>
                  <FaTag className="ml-6 mr-2" />
                  <span>
                    {deal.discountType === 'percentage' 
                      ? `${deal.discountValue}% OFF`
                      : `$${deal.discountValue} OFF`}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                {deal.couponCode && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        readOnly
                        value={deal.couponCode}
                        className="flex-1 block rounded-l-md border-gray-300 bg-gray-50"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(deal.couponCode!)}
                        className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2" />
                  <span>
                    Valid until {new Date(deal.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 