'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/ui/Loader';
import SearchBar from '@/components/Search/SearchBar';
import Link from 'next/link';
import { FaTag, FaNewspaper, FaStore, FaSearch, FaSadTear, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  type: 'deal' | 'store' | 'blog';
  url: string;
  image?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discountValue?: number;
}

// Create a separate component for the search content
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
    // Reset filter when query changes
    setActiveFilter('all');
  }, [query]);

  // Filter results based on active filter
  const filteredResults = activeFilter === 'all' 
    ? results 
    : results.filter(result => result.type === activeFilter);

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'relevance') {
      // Default sorting (already sorted by relevance from API)
      return 0;
    } else if (sortBy === 'newest') {
      // This would require createdAt from the API
      return 0;
    } else if (sortBy === 'price-low') {
      const aPrice = a.price || 0;
      const bPrice = b.price || 0;
      return aPrice - bPrice;
    } else if (sortBy === 'price-high') {
      const aPrice = a.price || 0;
      const bPrice = b.price || 0;
      return bPrice - aPrice;
    }
    return 0;
  });

  // Count results by type
  const dealCount = results.filter(r => r.type === 'deal').length;
  const blogCount = results.filter(r => r.type === 'blog').length;
  const storeCount = results.filter(r => r.type === 'store').length;

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    // Update URL with filter parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', filter);
    router.push(`/search?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    
    // Update URL with sort parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {query ? (
            <div className="flex items-center">
              <FaSearch className="mr-2 text-gray-500" />
              <span>Results for `{query}`</span>
            </div>
          ) : 'Search'}
        </h1>
        
        {results.length > 0 && (
          <p className="text-gray-500 mt-1 md:mt-0">
            Found {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader size="large" text="Searching..." />
          <p className="mt-4 text-gray-500">Looking for the best matches...</p>
        </div>
      ) : results.length > 0 ? (
        <>
          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters & Sort'}
            </button>
          </div>
          
          {/* Filters and sort options */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-6`}>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({results.length})
                  </button>
                  {dealCount > 0 && (
                    <button
                      onClick={() => handleFilterChange('deal')}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors ${
                        activeFilter === 'deal' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaTag className="mr-1" /> Deals ({dealCount})
                    </button>
                  )}
                  {blogCount > 0 && (
                    <button
                      onClick={() => handleFilterChange('blog')}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors ${
                        activeFilter === 'blog' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaNewspaper className="mr-1" /> Blogs ({blogCount})
                    </button>
                  )}
                  {storeCount > 0 && (
                    <button
                      onClick={() => handleFilterChange('store')}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors ${
                        activeFilter === 'store' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaStore className="mr-1" /> Stores ({storeCount})
                    </button>
                  )}
                </div>
                
                {/* Sort options */}
                <div className="flex items-center">
                  <FaSortAmountDown className="text-gray-400 mr-2" />
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="newest">Sort by: Newest</option>
                    <option value="price-low">Sort by: Price (Low to High)</option>
                    <option value="price-high">Sort by: Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results grid with animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedResults.map((result) => {
              if (result.type === 'deal') {
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard 
                      product={{
                        title: result.title,
                        description: result.description || '',
                        price: result.price || 0,
                        originalPrice: result.originalPrice || 0,
                        discountValue: result.discountValue || 0,
                        image: result.image || '/product-placeholder.png',
                        category: { _id: '', name: '', slug: '' },
                        link: result.url,
                        id: result.id
                      }} 
                    />
                  </motion.div>
                );
              } else if (result.type === 'blog') {
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={result.url}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                        {result.image ? (
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={result.image} 
                              alt={result.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/blog-placeholder.png';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-40 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                            <FaNewspaper className="text-blue-400 text-4xl" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center text-xs text-blue-600 mb-2">
                            <FaNewspaper className="mr-1" /> Blog
                          </div>
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">{result.title}</h3>
                          {result.description && (
                            <p className="text-gray-600 text-sm line-clamp-3">{result.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              } else {
                // Store or other content types
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={result.url}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                        {result.image ? (
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={result.image} 
                              alt={result.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/store-placeholder.png';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-40 bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center">
                            <FaStore className="text-purple-400 text-4xl" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center text-xs text-purple-600 mb-2">
                            <FaStore className="mr-1" /> Store
                          </div>
                          <h3 className="text-lg font-semibold mb-2 hover:text-purple-600 transition-colors">{result.title}</h3>
                          {result.description && (
                            <p className="text-gray-600 text-sm line-clamp-3">{result.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              }
            })}
          </motion.div>
        </>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <FaSadTear className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {query ? `No results found for ${query}` : 'Enter a search term'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {query 
              ? "We couldn't find any matches for your search. Try using different keywords or check for typos."
              : "Enter a search term to find deals, blogs, and stores."}
          </p>
          {query && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h4>
              <ul className="text-sm text-gray-600">
                <li>• Check for typos or misspellings</li>
                <li>• Try more general keywords</li>
                <li>• Try different keywords</li>
                <li>• Browse categories instead of searching</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<Loader size="large" text="Loading search..." />}>
        <SearchContent />
      </Suspense>
    </MainLayout>
  );
} 