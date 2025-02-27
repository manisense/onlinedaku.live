'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaTag, FaShoppingCart, FaClock, FaStore, FaPercent } from 'react-icons/fa';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Deal {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  price: number;
  originalPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  couponCode?: string;
  image?: string;
  link: string;
}

export default function DealDetailPage() {
  const params = useParams() as { id: string };
  const dealId = params.id;
  
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate time remaining
  const calculateTimeRemaining = (endDate: string): string => {
    const end = new Date(endDate);
    const now = new Date();
    
    if (now > end) return 'Expired';
    
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    }
    
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
  };

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/deals/${dealId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch deal details');
        }
        
        const data = await response.json();
        setDeal(data.deal);
      } catch (err) {
        setError('Failed to load deal details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (dealId) {
      fetchDeal();
    }
  }, [dealId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4 text-xl">{error || 'Deal not found'}</div>
        <Link
          href="/deals"
          className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FaArrowLeft className="mr-2" />
          Back to Deals
        </Link>
      </div>
    );
  }

  const isExpired = new Date() > new Date(deal.endDate);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/deals"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Deals
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="bg-gray-100 p-6 flex items-center justify-center">
              <div className="relative h-80 w-full">
                {deal.image ? (
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = '/product-placeholder.png';
                    }}
                  />
                ) : (
                  <Image 
                    src="/product-placeholder.svg" 
                    alt="No image available"
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                )}
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6">
              <div className="flex items-center mb-4 space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  deal.store.toLowerCase().includes('amazon') ? 'bg-yellow-100 text-yellow-800' :
                  deal.store.toLowerCase().includes('flipkart') ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <FaStore className="inline mr-1" />
                  {deal.store}
                </span>
                
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                  {deal.category}
                </span>
                
                {!isExpired ? (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    <FaClock className="inline mr-1" />
                    {calculateTimeRemaining(deal.endDate)}
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                    <FaClock className="inline mr-1" />
                    Expired
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {deal.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(deal.price)}
                  </div>
                  {deal.originalPrice > deal.price && (
                    <div className="ml-2 text-xl text-gray-500 line-through">
                      {formatCurrency(deal.originalPrice)}
                    </div>
                  )}
                </div>
                
                <div className="bg-indigo-100 px-4 py-2 rounded-full text-indigo-800">
                  <FaPercent className="inline mr-1" />
                  {deal.discountType === 'percentage' ? 
                    `${deal.discountValue}% OFF` : 
                    `${formatCurrency(deal.discountValue)} OFF`
                  }
                </div>
              </div>
              
              {deal.couponCode && (
                <div className="mb-6 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="text-sm text-indigo-800 mb-1">Coupon Code:</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaTag className="text-indigo-500 mr-2" />
                      <span className="font-mono text-lg font-bold tracking-wider">{deal.couponCode}</span>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(deal.couponCode || '');
                        alert('Coupon code copied to clipboard!');
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{deal.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-sm text-gray-500">Valid From</div>
                    <div className="font-medium">{formatDate(deal.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Valid Till</div>
                    <div className="font-medium">{formatDate(deal.endDate)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <a
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center text-center py-3 px-4 rounded-md text-white font-medium transition-colors ${
                    isExpired ? 
                    'bg-gray-500 cursor-not-allowed' : 
                    'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  onClick={(e) => {
                    if (isExpired) {
                      e.preventDefault();
                      alert('This deal has expired.');
                    }
                  }}
                >
                  <FaShoppingCart className="mr-2" />
                  {isExpired ? 'Deal Expired' : 'Go to Store & Buy Now'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
