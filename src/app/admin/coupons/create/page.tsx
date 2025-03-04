'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';

interface Store {
  _id: string;
  name: string;
  slug: string;
}

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);

  // Form fields state - simplified to match the sample object exactly
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    featured: false,
    url: '',
    affiliateLink: '',
    imageUrl: '',
    brandLogo: '',
    type: 'Code',
    store: '',
    storeSlug: '',
    startDate: '',
    endDate: '',
    status: 'active',
    rating: 5,
    label: '',
    isActive: true
  });

  // Form validation state - only validate what's actually required
  const [errors, setErrors] = useState({
    title: '',
    store: '',
    storeId: '', // for UI purposes
  });

  // Fetch stores for dropdown
  useEffect(() => {
    async function fetchStores() {
      try {
        setLoadingStores(true);
        const res = await fetch('/api/admin/stores?activeOnly=true');
        if (!res.ok) throw new Error('Failed to fetch stores');
        
        const data = await res.json();
        if (data.success) {
          setStores(data.data);
        } else {
          toast.error(data.message || 'Failed to load stores');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to load stores. Please try again.');
      } finally {
        setLoadingStores(false);
      }
    }

    fetchStores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }
    
    // Special handling for store selection 
    if (name === 'storeId') {
      const selectedStore = stores.find(store => store._id === value);
      if (selectedStore) {
        setFormData({
          ...formData,
          store: selectedStore.name,
          storeSlug: selectedStore.slug
        });
        
        // Clear store error
        setErrors({
          ...errors,
          store: '',
          storeId: ''
        });
      }
      return;
    }

    // Update form data for other fields
    setFormData({ ...formData, [name]: value });
    
    // Clear errors for this field if it has a value
    if (value && name in errors) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = { title: '', store: '', storeId: '' };
    let isValid = true;

    // Only validate the minimal required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.store) {
      newErrors.store = 'Store is required';
      newErrors.storeId = 'Please select a store';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data that exactly matches our sample object structure
      const couponData = {
        offerId: `admin-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        title: formData.title,
        description: formData.description || '',
        code: formData.code || '',
        featured: formData.featured,
        url: formData.url || '',
        affiliateLink: formData.affiliateLink || '',
        imageUrl: formData.imageUrl || '',
        brandLogo: formData.brandLogo || '',
        type: formData.type, // Using 'Code' string directly to match sample object
        store: formData.store,
        storeSlug: formData.storeSlug,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        status: formData.status,
        rating: Number(formData.rating),
        label: formData.label || '',
        isActive: formData.isActive
      };

      console.log("Submitting coupon data:", couponData);

      // Send to API
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create coupon');
      }

      toast.success('Coupon created successfully!');
      router.push('/admin/coupons');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error creating coupon:', error);
      toast.error(errorMessage || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Rest of component remains the same
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header remains the same */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Create New Coupon</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 flex items-center gap-1 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaTimes size={16} />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {loadingStores ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="large" text="Loading stores..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 required">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter coupon title"
                  required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter description"
                />
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Code">Code</option>
                  <option value="Deal">Deal</option>
                </select>
              </div>

              {/* Coupon Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. SUMMER25"
                />
              </div>

              {/* Store */}
              <div>
                <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1 required">
                  Store
                </label>
                <select
                  id="storeId"
                  name="storeId"
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.storeId ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                >
                  <option value="">Select a store</option>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                {errors.storeId && <p className="mt-1 text-sm text-red-600">{errors.storeId}</p>}
              </div>

              {/* Label */}
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 25% OFF"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. https://example.com/offer"
                />
              </div>

              {/* Affiliate Link */}
              <div>
                <label htmlFor="affiliateLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliate Link
                </label>
                <input
                  type="url"
                  id="affiliateLink"
                  name="affiliateLink"
                  value={formData.affiliateLink}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. https://example.com/offer?ref=affiliate"
                />
              </div>

              {/* Brand Logo */}
              <div>
                <label htmlFor="brandLogo" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Logo URL
                </label>
                <input
                  type="url"
                  id="brandLogo"
                  name="brandLogo"
                  value={formData.brandLogo}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. https://example.com/logo.png"
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. https://example.com/image.jpg"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Additional Options</h2>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured Coupon
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-5 border-t">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader size="small" />
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaSave className="mr-2" />
                    <span>Save Coupon</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-8 border-t pt-6">
        <h3 className="text-sm font-medium text-gray-500">Fields with <span className="text-red-500">*</span> are required</h3>
      </div>

      <style jsx global>{`
        .required:after {
          content: " *";
          color: red;
        }
      `}</style>
    </div>
  );
}