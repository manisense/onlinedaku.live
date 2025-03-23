"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useSearchParams } from 'next/navigation';
import DealsPageSkeleton from '@/components/ui/DealsPageSkeleton';
import Link from 'next/link';

interface Deal {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  store: string;
  category: string | {
    _id: string;
    name: string;
    slug: string;
  };
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  image: string;
  link: string;
  startDate: string;
  endDate: string;
  couponCode?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Create a separate component that uses useSearchParams
function DealsContent() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // Use a ref to prevent infinite fetching
  const fetchedRef = useRef(false);
  //const router = useRouter();
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
        const limit = '12'; // Number of items per page
        params.append('page', page);
        params.append('limit', limit);
        
        // Append query parameters to URL if any exist
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          // Try to get error details from response body
          let errorMessage = `HTTP error! Status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch {
            // If we can't parse the error response, just use the status code message
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setDeals(data.deals || []);
        
        // Set pagination data
        setPagination({
          currentPage: parseInt(page),
          totalPages: data.pagination?.totalPages || 1,
          totalItems: data.pagination?.total || 0
        });
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

  // Function to create page URL with current filters
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

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
                    {deals.map((deal) => {
                      // Safely handle category data
                      let categoryData = { _id: '', name: 'Uncategorized', slug: '' };
                      
                      if (deal.category) {
                        if (typeof deal.category === 'string') {
                          categoryData = { _id: '', name: deal.category, slug: deal.category.toLowerCase().replace(/\s+/g, '-') };
                        } else if (typeof deal.category === 'object') {
                          categoryData = { 
                            _id: deal.category._id || '',
                            name: deal.category.name || 'Uncategorized',
                            slug: deal.category.slug || ''
                          };
                        }
                      }
                      
                      return (
                        <ProductCard 
                          key={deal._id} 
                          product={{
                            title: deal.title,
                            description: deal.description,
                            price: deal.price,
                            originalPrice: deal.originalPrice,
                            discountValue: deal.discountValue,
                            image: deal.image || '/product-placeholder.png',
                            category: categoryData,
                            link: deal.link,
                            id: deal._id
                          }} 
                        />
                      );
                    })}
                  </div>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Previous Page Button */}
                        <Link
                          href={pagination.currentPage > 1 ? createPageUrl(pagination.currentPage - 1) : '#'}
                          className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            pagination.currentPage === 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-disabled={pagination.currentPage === 1}
                        >
                          Previous
                        </Link>
                        
                        {/* Page Numbers */}
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            // Show pages within 2 of current page, and first/last pages
                            return page === 1 || 
                                  page === pagination.totalPages || 
                                  Math.abs(page - pagination.currentPage) <= 1;
                          })
                          .map((page, index, array) => {
                            // Add an ellipsis if there's a gap
                            const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                            
                            return (
                              <React.Fragment key={page}>
                                {showEllipsisBefore && (
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                )}
                                <Link
                                  href={createPageUrl(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === pagination.currentPage
                                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                  aria-current={page === pagination.currentPage ? 'page' : undefined}
                                >
                                  {page}
                                </Link>
                              </React.Fragment>
                            );
                          })}
                        
                        {/* Next Page Button */}
                        <Link
                          href={pagination.currentPage < pagination.totalPages ? createPageUrl(pagination.currentPage + 1) : '#'}
                          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            pagination.currentPage === pagination.totalPages 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-disabled={pagination.currentPage === pagination.totalPages}
                        >
                          Next
                        </Link>
                      </nav>
                    </div>
                  )}
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