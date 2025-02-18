"use client"

import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

const coupons = [
  {
    id: 1,
    code: 'SUMMER25',
    title: 'Summer Special Discount',
    description: '25% off on all summer collection items',
    store: 'Fashion Nova',
    discount: '25%',
    expiryDate: '2024-03-15',
    category: 'Fashion',
    terms: 'Minimum purchase of $50 required'
  },
  {
    id: 2,
    code: 'TECH100',
    title: 'Electronics Super Sale',
    description: '$100 off on purchases above $500',
    store: 'TechWorld',
    discount: '$100',
    expiryDate: '2024-02-28',
    category: 'Electronics',
    terms: 'Valid on selected electronics only'
  },
  {
    id: 3,
    code: 'BOOKS30',
    title: 'Book Lovers Special',
    description: '30% off on all books',
    store: 'BookWorm',
    discount: '30%',
    expiryDate: '2024-03-31',
    category: 'Books',
    terms: 'Not valid on textbooks'
  },
  {
    id: 4,
    code: 'HOME50',
    title: 'Home Decor Deal',
    description: '50% off on home decor items',
    store: 'HomeStyle',
    discount: '50%',
    expiryDate: '2024-03-20',
    category: 'Home & Living',
    terms: 'Selected items only'
  }
];

const categories = ['All', 'Fashion', 'Electronics', 'Books', 'Home & Living', 'Food', 'Travel'];

export default function CouponsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCoupons = coupons.filter(coupon =>
    selectedCategory === 'All' ? true : coupon.category === selectedCategory
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Coupons</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map(coupon => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <div className="text-sm text-gray-500">
                  <p>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                  <p className="mt-2 text-xs">{coupon.terms}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </MainLayout>
  );
}