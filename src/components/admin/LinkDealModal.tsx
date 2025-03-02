'use client';

import { useState, useEffect } from 'react';
import { FaSpinner, FaTimes, FaLink, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ExternalImage from '@/components/ui/ExternalImage';

interface LinkDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealData: DealData) => Promise<void>;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
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
  category: string;
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
    category: '',
  });
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;
      
      try {
        setLoadingCategories(true);
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

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
        // Handle error but allow manual entry if partialData is available
        if (data.partialData) {
          setProductData(data.partialData);
          setDealData({
            ...dealData,
            title: data.partialData.title || '',
            description: data.partialData.description || '',
            price: data.partialData.price || 0,
            originalPrice: data.partialData.originalPrice || 0,
            store: data.partialData.store || '',
            image: data.partialData.image || '',
            link: url.trim(),
          });
          toast('Some product details could not be extracted. Please review and complete.', {
            icon: '⚠️',
            style: { background: '#FFF3CD', color: '#856404' }
          });
          return;
        }
        
        setError(data.error || 'Failed to fetch product data');
        toast.error('Could not extract product information. You can add details manually.');
        return;
      }

      setProductData(data.productData);
      
      // Try to determine a suitable category based on product title or description
      let suggestedCategory = '';
      if (categories.length > 0) {
        // Simple keyword matching for category suggestion
        const productTitle = data.productData.title.toLowerCase();
        const productDesc = (data.productData.description || '').toLowerCase();
        
        // Check for common category keywords in title and description
        for (const category of categories) {
          const categoryName = category.name.toLowerCase();
          if (productTitle.includes(categoryName) || productDesc.includes(categoryName)) {
            suggestedCategory = category._id;
            break;
          }
        }
      }
      
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
        category: suggestedCategory || dealData.category,
      });

      toast.success('Product details fetched successfully');

    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Network error while fetching product data');
      toast.error('Failed to connect to server. Please try again later.');
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
      // Calculate discount percentage based on prices
      const discountPercentage = 
        dealData.originalPrice && dealData.price && dealData.originalPrice > dealData.price
          ? Math.round(((dealData.originalPrice - dealData.price) / dealData.originalPrice) * 100)
          : 0;

      // Prepare the deal data for submission
      const completeData: DealData = {
        ...dealData as DealData,
        discountType: 'percentage',
        discountValue: discountPercentage,
        startDate: dealData.startDate || new Date(),
        endDate: dealData.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive: true
      };

      await onSubmit(completeData);
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
      category: '',
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
                      <ExternalImage
                        src={productData.image}
                        alt={productData.title}
                        width={100}
                        height={100}
                        className="object-contain border rounded"
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
                    Category
                  </label>
                  <select
                    value={dealData.category || ''}
                    onChange={(e) => setDealData({ ...dealData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loadingCategories}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {loadingCategories && (
                    <div className="mt-1 text-xs text-gray-500 flex items-center">
                      <FaSpinner className="animate-spin mr-1" /> Loading categories...
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Price (₹)
                  </label>
                  <input
                    type="number"
                    value={dealData.price || 0}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      price: parseFloat(e.target.value),
                      // Auto-calculate discountPercentage when price changes
                      discountValue: dealData.originalPrice && parseFloat(e.target.value) < dealData.originalPrice
                        ? Math.round(((dealData.originalPrice - parseFloat(e.target.value)) / dealData.originalPrice) * 100)
                        : dealData.discountValue
                    })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MRP / Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={dealData.originalPrice || 0}
                    onChange={(e) => setDealData({ 
                      ...dealData, 
                      originalPrice: parseFloat(e.target.value),
                      // Auto-calculate discountPercentage when original price changes
                      discountValue: dealData.price && parseFloat(e.target.value) > dealData.price
                        ? Math.round(((parseFloat(e.target.value) - dealData.price) / parseFloat(e.target.value)) * 100)
                        : dealData.discountValue
                    })}
                    className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                    required
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
