"use client"

import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';
import Loader from '@/components/ui/Loader';
import { useState, useEffect } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface Coupon {
  _id: string;
  code: string;
  title: string;
  description: string;
  store: string;
  website: string;
  discount: string;
  expiryDate: string;
  category: string;
  terms: string;
  type: 'couponcode' | 'offer';
}

const categories = ['All', 'Fashion', 'Electronics', 'Books', 'Home & Living', 'Food', 'Travel'];

export default function CouponsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCoupons();
  }, [selectedCategory, page]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/coupons?page=${page}&category=${selectedCategory}&limit=12`
      );
      if (!response.ok) throw new Error('Failed to fetch coupons');
      
      const data = await response.json();
      setCoupons(data.coupons);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load coupons. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <MainLayout>
      <SearchBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
               <Loader size='large'  text='Loading...' />
                          </div>
          ) : (
            /* Coupons Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map(coupon => (
                <div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{coupon.title}</h3>
                        <p className="text-sm text-gray-500">{coupon.store}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {coupon.discount} OFF
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>
                    {coupon.type === 'couponcode' && coupon.code && (
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between mb-4">
                        <code className="text-sm font-mono font-medium">{coupon.code}</code>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="flex items-center text-indigo-600 hover:text-indigo-500"
                        >
                          {copiedCode === coupon.code ? (
                            <>
                              <FaCheck className="w-4 h-4 mr-2" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaCopy className="w-4 h-4 mr-2" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {coupon.type === 'offer' && (
                      <a
                        href={coupon.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors mb-4"
                      >
                        Get Offer
                      </a>
                    )}
                    <div className="text-sm text-gray-500">
                      <p>Expires: {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(coupon.expiryDate))}</p>
                      <p className="mt-2 text-xs">{coupon.terms}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {totalPages}
              </span>
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