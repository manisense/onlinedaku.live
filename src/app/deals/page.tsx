"use client"

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useLoading } from '@/context/LoadingContext';
import Loader from '@/components/ui/Loader';
import SearchBar from '@/components/Search/SearchBar';
import ProductCard from '@/components/ProductCard';

interface Deal {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  store: string;
  category: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  image: string;
  link: string;
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

          <SearchBar />

      <div className="min-h-screen bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader size="large" text="Finding deals for you..." />
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No deals found</p>
            </div>
          ) : (
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {deals.map((deal) => (
                  <ProductCard 
                    key={deal._id} 
                    product={{
                      title: deal.title,
                      description: deal.description,
                      price: deal.price,
                      originalPrice: deal.originalPrice,
                      discountValue: deal.discountValue,
                      image: deal.image,
                      link: deal.link,
                      id: deal._id
                    }} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}