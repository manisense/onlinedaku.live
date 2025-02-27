'use client';

import { useState } from 'react';
import { FaSpinner, FaTimes, FaLink, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface LinkDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealData: DealData) => Promise<void>;
}

interface ProductData {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  store: 'amazon' | 'flipkart' | 'myntra' | 'other';
  link: string;
}

interface DealData {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  store: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  image?: string;
  link: string;
  couponCode?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export default function LinkDealModal({ isOpen, onClose, onSubmit }: LinkDealModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [dealData, setDealData] = useState<Partial<DealData>>({
    isActive: true,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default 1 month
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError('');
  };

  const fetchProductData = async () => {
    if (!url || !url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/deals/fetch-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product data');
      }

      setProductData(data.productData);
      
      // Pre-fill deal data
      setDealData({
        ...dealData,
        title: data.productData.title,
        description: data.productData.description || '',
        price: data.productData.price,
        originalPrice: data.productData.originalPrice,
        store: data.productData.store,
        discountType: 'percentage',
        discountValue: data.productData.discountPercentage,
        image: data.productData.image,
        link: data.productData.link,
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dealData.title || !dealData.store) {
      setError('Title and store are required fields');
      return;
    }

    try {
      await onSubmit(dealData as DealData);
      toast.success('Deal successfully created from product link');
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error submitting deal:', err);
      toast.error('Failed to add deal');
    }
  };

  const resetForm = () => {
    setUrl('');
    setProductData(null);
    setDealData({
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    });
    setError('');
  };

  // Function to truncate text
  const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Deal from Product Link</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product URL
            </label>
            <div className="flex">
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://www.amazon.in/product/..."
                className="flex-grow px-4 py-2 border rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={fetchProductData}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none flex items-center"
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaLink className="mr-2" />}
                {loading ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Supported stores: Amazon, Flipkart, and Myntra
            </p>
          </div>
          
          {productData && (
            <form onSubmit={handleSubmit}>
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 flex items-start">
                  {productData.image && (
                    <div className="mr-4 flex-shrink-0">
                      <Image 
                        src={productData.image}
                        alt={productData.title}
                        width={100}
                        height={100}
                        className="object-contain border rounded"
                        onError={(e) => {
                          // Fallback for image loading errors
                          e.currentTarget.src = '/product-placeholder.png';
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{truncateText(productData.title, 80)}</h3>
                    <p className="text-gray-600 text-sm mt-1">{productData.store}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-lg font-bold">₹{productData.price}</span>
                      {productData.discountPercentage > 0 && (
                        <>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{productData.originalPrice}
                          </span>
                          <span className="ml-2 text-sm text-green-600">
                            {productData.discountPercentage}% off
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-xs text-gray-500">(max 120 chars)</span>
                  </label>
                  <input
                    type="text"
                    value={dealData.title || ''}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      title: e.target.value.substring(0, 120) 
                    })}
                    maxLength={120}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {dealData.title ? dealData.title.length : 0}/120
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store
                  </label>
                  <input
                    type="text"
                    value={dealData.store || ''}
                    onChange={(e) => setDealData({ ...dealData, store: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={dealData.discountType || 'percentage'}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      discountType: e.target.value as 'percentage' | 'fixed'
                    })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={dealData.discountValue || 0}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      discountValue: parseFloat(e.target.value) 
                    })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dealData.startDate ? new Date(dealData.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      startDate: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dealData.endDate ? new Date(dealData.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      endDate: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code (optional)
                  </label>
                  <input
                    type="text"
                    value={dealData.couponCode || ''}
                    onChange={(e) => setDealData({ ...dealData, couponCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-xs text-gray-500">(max 500 chars)</span>
                  </label>
                  <textarea
                    value={dealData.description || ''}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      description: e.target.value.substring(0, 500) 
                    })}
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {dealData.description ? dealData.description.length : 0}/500
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Add Deal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
