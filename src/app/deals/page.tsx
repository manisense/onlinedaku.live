"use client"

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useLoading } from '@/context/LoadingContext';
import Loader from '@/components/ui/Loader';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { showLoader, hideLoader } = useLoading();
  
  // Use a ref to prevent infinite fetching
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    async function fetchDeals() {
      try {
        setIsLoading(true);
        showLoader('Loading awesome deals for you...');
        
        const response = await fetch('/api/deals');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDeals(data.deals || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load deals');
      } finally {
        setIsLoading(false);
        hideLoader();
      }
    }

    fetchDeals();
  }, []); // Empty dependency array with ref check prevents continuous requests

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
          
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader size="medium" text="Finding deals for you..." />
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No deals found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <div key={deal._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                    <p className="text-sm text-gray-500">{deal.store}</p>
                    <p className="text-gray-600 text-sm mt-2 mb-4">{deal.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `$${deal.discountValue}`} OFF
                      </span>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(deal.endDate).toLocaleDateString()}
                      </p>
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