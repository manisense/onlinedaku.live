"use client"

import { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import CouponCard from '@/components/CouponCard';
import Loader from '@/components/ui/Loader';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import SearchBar from '@/components/Search/SearchBar';

interface Coupon {
  _id: string;
  offerId: string;
  title: string;
  description: string;
  code: string;
  featured: boolean;
  source: string;
  url: string;
  affiliateLink: string;
  imageUrl: string;
  brandLogo: string;
  type: string;
  store: string;
  startDate: string;
  endDate: string;
  status: string;
  rating: number;
  label: string;
  isActive: boolean;
  storeSlug: string;
  createdAt: string;
  updatedAt: string;
  terms?: string;
}

// Define interface for store items
interface StoreItem {
  _id: string;
  name: string;
  slug: string;
}

export default function CouponsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<{_id: string; name: string; slug: string}[]>([]);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [selectedStore, setSelectedStore] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Renamed from loadingCategories
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
    fetchStores();
  }, [selectedCategory, selectedStore, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('/api/categories?activeOnly=true');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        if (data.success && data.categories) {
          // Add 'All' option at the beginning
          setCategories([{ _id: 'All', name: 'All Categories', slug: 'all' }, ...data.categories]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  const fetchStores = async () => {
    try {
      setIsLoadingStores(true);
      const response = await fetch('/api/stores');
      if (!response.ok) throw new Error('Failed to fetch stores');
      
      const data = await response.json();
      if (data.success && data.data) {
        // Map API response to StoreItem array
        const storeItems: StoreItem[] = data.data.map((store: StoreItem) => ({
          _id: store._id,
          name: store.name,
          slug: store.slug
        }));
        // Add 'All' option
        setStores([{ _id: 'All', name: 'All Stores', slug: 'all' }, ...storeItems]);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });
      
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedStore !== 'All') params.append('store', selectedStore);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/coupons?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch coupons');
      
      const data = await response.json();
      setCoupons(data.coupons || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError('Failed to load coupons. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    fetchCoupons();
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedStore('All');
    setSearchTerm('');
    setPage(1);
    fetchCoupons();
  };

  return (
    <MainLayout>
      <SearchBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest Coupons & Deals</h1>
            <p className="text-gray-600 mb-6">Find the best coupons and deals from your favorite stores.</p>
            
          
            
            {/* Expanded Filter Options */}
            {filterOpen && (
              <div className="bg-white p-4 rounded-md shadow-sm mb-6 border border-gray-200">
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Filters</h3>
                  <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Categories Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                    {isLoadingCategories ? (
                      <div className="py-2 px-3 bg-gray-100 animate-pulse rounded-md h-10"></div>
                    ) : (
                      <select
                        value={selectedCategory}
                        onChange={(e) => { 
                          setSelectedCategory(e.target.value);
                          setPage(1);
                        }}
                        className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {/* Stores Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stores</label>
                    {isLoadingStores ? (
                      <div className="py-2 px-3 bg-gray-100 animate-pulse rounded-md h-10"></div>
                    ) : (
                      <select
                        value={selectedStore}
                        onChange={(e) => { 
                          setSelectedStore(e.target.value);
                          setPage(1); 
                        }}
                        className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        {stores.map(store => (
                          <option key={store._id} value={store._id}>{store.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12 bg-red-50 rounded-md">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => {
                  setError('');
                  fetchCoupons();
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader size="large" text="Loading coupons..." />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No coupons found matching your criteria.</p>
            </div>
          ) : (
            /* Coupons Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map(coupon => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  // Show first page, last page, and pages around current page
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          page === pageNumber
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  if (
                    (pageNumber === 2 && page > 3) || 
                    (pageNumber === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return <span key={pageNumber} className="px-1">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}