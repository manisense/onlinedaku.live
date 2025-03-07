"use client"

import { useState, useEffect, useRef, Suspense } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useSearchParams } from 'next/navigation';
import { Types } from 'mongoose';
import DealsPageSkeleton from '@/components/ui/DealsPageSkeleton';

interface Deal {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  store: string;
  category: string | Types.ObjectId;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  image: string;
  link: string;
  startDate: string;
  endDate: string;
  couponCode?: string;
}

// Create a separate component that uses useSearchParams
function DealsContent() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Use a ref to prevent infinite fetching
  const fetchedRef = useRef(false);

  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Reset the fetch flag when search params change
    fetchedRef.current = false;
  }, [searchParams]);
  
  useEffect(() => {
    // Only fetch once per search params change
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    async function fetchDeals() {
      try {
        setIsLoading(true);
        // Don't show the global loader, we'll use the skeleton instead
        
        // Get category from URL if present
        const categorySlug = searchParams.get('category');
        const storeParam = searchParams.get('store');
        
        // Build URL with query parameters
        let url = '/api/deals';
        const params = new URLSearchParams();
        
        if (categorySlug) {
          params.append('category', categorySlug);
        }
        
        if (storeParam) {
          params.append('store', storeParam);
        }
        
        // Add pagination parameters
        const page = searchParams.get('page') || '1';
        params.append('page', page);
        
        // Append query parameters to URL if any exist
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDeals(data.deals || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load deals');
      } finally {
        // Add a small delay to show the skeleton for a moment
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    }

    fetchDeals();
  }, [searchParams]); // Update when search params change

  if (isLoading) {
    return <DealsPageSkeleton />;
  }

  return (
    <>
      <SearchBar />
      <div className="min-h-screen bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">            
            <div className="md:w-1/4 lg:w-1/5">
              <CategoryFilter className="sticky top-20" />
            </div>
            
            <div className="md:w-3/4 lg:w-4/5">
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}
              
              {deals.length === 0 ? (
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
                          image: deal.image || '/product-placeholder.png',
                          category: typeof deal.category === 'string' ? { _id: '', name: deal.category, slug: deal.category } : { _id: '', name: '', slug: '' },
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
        </div>
      </div>
    </>
  );
}

// Main exported component with Suspense boundary
export default function DealsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<DealsPageSkeleton />}>
        <DealsContent />
      </Suspense>
    </MainLayout>
  );
}