'use client';

import { useState, useEffect } from 'react';
import { FaSpinner, FaTimes, FaLink, FaShoppingCart, FaMagic, FaCode } from 'react-icons/fa';
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
  store: string;
  link: string;
  category?: string;
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

type ExtractionMethod = 'firecrawl' | 'standard';

export default function LinkDealModal({ isOpen, onClose, onSubmit }: LinkDealModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractionMethod, setExtractionMethod] = useState<ExtractionMethod>('firecrawl');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [dealData, setDealData] = useState<Partial<DealData>>({
    isActive: true,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    category: '',
  });
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories when modal opens
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

  const extractWithFireCrawl = async () => {
    if (!url || !url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to extract product data');
        toast.error('Could not extract product information with AI extraction. Please try the standard method instead.');
        setLoading(false);
        return;
      }

      // Handle successful AI extraction
      if (data.result && data.result.product) {
        const extractedProduct = data.result.product;
        
        // Convert to our ProductData format
        const product: ProductData = {
          title: extractedProduct.title,
          description: extractedProduct.description || '',
          price: extractedProduct.price || 0,
          originalPrice: extractedProduct.originalPrice || 0,
          discountPercentage: extractedProduct.discountPercentage || 0,
          image: extractedProduct.image || '',
          store: extractedProduct.store || '',
          category: extractedProduct.category || '',
          link: url.trim()
        };
        
        processExtractedProduct(product);
        toast.success('Product details extracted successfully using AI');
      } else {
        setError('Invalid response format from AI extraction service');
        toast.error('Failed to parse product details');
      }
    } catch (err) {
      console.error('Error extracting product with AI:', err);
      setError('Network error while extracting data with AI');
      toast.error('Failed to connect to AI extraction service. Please try the standard method instead.');
    } finally {
      setLoading(false);
    }
  };

  const extractWithStandardMethod = async () => {
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

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to fetch product data');
        toast.error('Could not extract product information using standard method. Please try the AI extraction instead.');
        setLoading(false);
        return;
      }

      // Handle successful extraction
      if (data.productData) {
        processExtractedProduct(data.productData);
        toast.success('Product details extracted successfully using standard method');
      } else {
        setError('Invalid response format from standard extraction');
        toast.error('Failed to parse product details');
      }
    } catch (err) {
      console.error('Error extracting product with standard method:', err);
      setError('Network error while extracting data');
      toast.error('Failed to connect to standard extraction service. Please try the AI method instead.');
    } finally {
      setLoading(false);
    }
  };

  // Common processing for extracted products from either method
  const processExtractedProduct = (product: ProductData) => {
    setProductData(product);
    
    // Try to find a matching category if one was extracted
    let suggestedCategory = '';
    if (product.category && categories.length > 0) {
      // Look for exact match first
      const matchingCategory = categories.find(
        cat => cat.name.toLowerCase() === product.category?.toLowerCase()
      );
      
      if (matchingCategory) {
        suggestedCategory = matchingCategory._id;
      } else {
        // Try partial match
        for (const category of categories) {
          const categoryName = category.name.toLowerCase();
          if (product.category.toLowerCase().includes(categoryName)) {
            suggestedCategory = category._id;
            break;
          }
        }
      }
    }
    
    // If no category was found by exact/partial match, try keyword matching
    if (!suggestedCategory && categories.length > 0) {
      const productTitle = product.title.toLowerCase();
      const productDesc = (product.description || '').toLowerCase();
      
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
      title: product.title,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice,
      store: product.store,
      discountType: 'percentage',
      discountValue: product.discountPercentage,
      image: product.image,
      link: product.link,
      category: suggestedCategory || dealData.category,
    });
  };

  const handleFetch = () => {
    if (extractionMethod === 'firecrawl') {
      extractWithFireCrawl();
    } else {
      extractWithStandardMethod();
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

  const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-800 rounded-lg p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 text-gray-800 border-b flex items-center justify-between">
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
            <div className="flex flex-col space-y-3">
              <div className="flex text-indigo-900">
                <input
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://www.example.com/product/..."
                  className="flex-grow px-4 py-2 border rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none flex items-center"
                >
                  {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaLink className="mr-2" />}
                  {loading ? 'Extracting...' : 'Extract'}
                </button>
              </div>
              
              {/* Extraction Method Selection */}
              <div className="flex flex-wrap items-center justify-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="firecrawl-method"
                    name="extraction-method"
                    value="firecrawl"
                    checked={extractionMethod === 'firecrawl'}
                    onChange={() => setExtractionMethod('firecrawl')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="firecrawl-method" className="ml-2 flex items-center text-sm text-gray-700">
                    <FaMagic className="mr-1 text-purple-500" />
                    AI Extraction (Universal)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="standard-method"
                    name="extraction-method"
                    value="standard"
                    checked={extractionMethod === 'standard'}
                    onChange={() => setExtractionMethod('standard')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="standard-method" className="ml-2 flex items-center text-sm text-gray-700">
                    <FaCode className="mr-1 text-blue-500" />
                    Standard Method (Amazon, Flipkart, etc.)
                  </label>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-500">
                {extractionMethod === 'firecrawl' ? (
                  <span>AI extraction works with most product pages and provides better category detection</span>
                ) : (
                  <span>Standard extraction is optimized for specific e-commerce sites like Amazon and Flipkart</span>
                )}
              </div>
            </div>
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
                     Original Price (₹)
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
