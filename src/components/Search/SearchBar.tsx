"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes, FaTag, FaNewspaper, FaStore, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Handle clicks outside the search component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Command+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
      
      // Escape to close search results
      if (e.key === 'Escape' && showResults) {
        setShowResults(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showResults]);

  // Debounce search to avoid too many requests
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setShowResults(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Save to recent searches
    saveRecentSearch(query);
    
    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowResults(false);
  };

  const handleResultClick = (url: string) => {
    saveRecentSearch(query);
    router.push(url);
    setShowResults(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const saveRecentSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    // Add to recent searches (avoid duplicates and limit to 5)
    const updatedSearches = [
      trimmedQuery,
      ...recentSearches.filter(s => s !== trimmedQuery)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowResults(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Get icon based on result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deal':
        return <FaTag className="text-green-500" />;
      case 'blog':
        return <FaNewspaper className="text-blue-500" />;
      case 'store':
        return <FaStore className="text-purple-500" />;
      default:
        return null;
    }
  };

  // Get color based on result type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deal':
        return 'bg-green-100 text-green-800';
      case 'blog':
        return 'bg-blue-100 text-blue-800';
      case 'store':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative w-full p-3 max-w-4xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals, blogs, or stores..."
            className="w-full py-3 pl-12 pr-12 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            onFocus={() => setShowResults(true)}
            aria-label="Search"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <FaSearch className="w-4 h-4 text-gray-500" />
          </div>
          
          {/* Keyboard shortcut indicator */}
          <div className="absolute inset-y-0 right-0 hidden md:flex items-center pr-4 pointer-events-none">
            {!query ? (
              <div className="flex items-center space-x-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                <span className="font-medium">Ctrl</span>
                <span>+</span>
                <span className="font-medium">K</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 focus:outline-none pointer-events-auto"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Search results dropdown with animation */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl max-h-[70vh] overflow-y-auto border border-gray-200"
          >
            {isSearching ? (
              <div className="p-6 text-center text-gray-500">
                <FaSpinner className="animate-spin mx-auto h-6 w-6 mb-2" />
                <p>Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Search Results
                </div>
                <ul>
                  {results.map((result) => (
                    <li key={result.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => handleResultClick(result.url)}
                        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center text-left"
                      >
                        {result.image ? (
                          <img 
                            src={result.image} 
                            alt={result.title} 
                            className="w-12 h-12 object-cover rounded mr-4 border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/product-placeholder.png';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded mr-4">
                            {getTypeIcon(result.type)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{result.title}</div>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(result.type)}`}>
                              {getTypeIcon(result.type)}
                              <span className="ml-1">
                                {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                              </span>
                            </span>
                          </div>
                          {result.description && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                              {result.description}
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-3 border-t">
                  <button 
                    onClick={handleSearch}
                    className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all results for `{query}`
                  </button>
                </div>
              </div>
            ) : query.trim() ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-2">No results found for `{query}`</p>
                <button 
                  onClick={handleSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Search anyway
                </button>
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 flex justify-between items-center border-b">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</span>
                  <button 
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <ul>
                  {recentSearches.map((search, index) => (
                    <li key={index} className="border-b last:border-b-0">
                      <button
                        onClick={() => handleRecentSearchClick(search)}
                        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center text-left"
                      >
                        <FaSearch className="text-gray-400 mr-3" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Start typing to search</p>
                <p className="text-xs mt-1">Search for deals, blogs, and stores</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}