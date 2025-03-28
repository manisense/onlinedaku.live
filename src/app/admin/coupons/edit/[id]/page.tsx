'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { toast } from 'react-hot-toast';

interface Store {
  _id: string;
  name: string;
  slug: string;
}

interface Coupon {
  _id: string;
  title: string;
  description: string;
  code: string;
  type: string;
  store: string;
  storeId?: string;
  storeName?: string;
  storeSlug: string;
  url: string;
  affiliateLink: string;
  imageUrl: string;
  brandLogo: string;
  featured: boolean;
  startDate: string | null;
  endDate: string | null;
  status: string;
  label: string;
  rating: number;
  isActive: boolean;
  offerId?: string;
}

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form fields state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    type: 'Code',
    storeId: '',
    storeName: '',
    storeSlug: '',
    url: '',
    affiliateLink: '',
    imageUrl: '',
    brandLogo: '',
    label: '',
    featured: false,
    status: 'active',
    isActive: true,
    startDate: '',
    endDate: '',
    rating: 5
  });

  // Form validation state
  const [errors, setErrors] = useState({
    title: '',
    code: '',
    label: '',
    storeId: '',
    startDate: '',
    endDate: ''
  });

  // Fetch coupon data
  useEffect(() => {
    async function fetchCouponData() {
      try {
        setLoadingCoupon(true);
        const res = await fetch(`/api/admin/coupons/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            toast.error('Coupon not found');
            router.push('/admin/coupons');
            return;
          }
          throw new Error('Failed to fetch coupon');
        }
        
        const data = await res.json();
        if (data.success) {
          setCoupon(data.data);
          
          // Format dates for input fields
          const startDate = data.data.startDate 
            ? new Date(data.data.startDate).toISOString().split('T')[0]
            : '';
            
          const endDate = data.data.endDate
            ? new Date(data.data.endDate).toISOString().split('T')[0]
            : '';
            
          // Set form data
          setFormData({
            title: data.data.title || '',
            description: data.data.description || '',
            code: data.data.code || '',
            type: data.data.type || 'Code',
            storeId: data.data.storeId || '',
            storeName: data.data.store || '',
            storeSlug: data.data.storeSlug || '',
            url: data.data.url || '',
            affiliateLink: data.data.affiliateLink || '',
            imageUrl: data.data.imageUrl || '',
            brandLogo: data.data.brandLogo || '',
            label: data.data.label || '',
            featured: Boolean(data.data.featured),
            status: data.data.status || 'active',
            isActive: typeof data.data.isActive === 'boolean' ? data.data.isActive : true,
            startDate,
            endDate,
            rating: data.data.rating || 5
          });
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
        toast.error('Failed to load coupon details');
      } finally {
        setLoadingCoupon(false);
      }
    }

    fetchCouponData();
  }, [id]);

  // Fetch stores data
  useEffect(() => {
    async function fetchStoresData() {
      try {
        setLoadingStores(true);
        console.log('Fetching stores data...');
        const res = await fetch('/api/admin/stores');
        
        if (!res.ok) {
          throw new Error('Failed to fetch stores');
        }
        
        const data = await res.json();
        console.log('Stores API response:', data);
        
        if (data.success) {
          console.log('Setting stores:', data.stores);
          setStores(data.stores);
        } else {
          console.warn('Invalid stores data format:', data);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to load stores');
      } finally {
        setLoadingStores(false);
      }
    }

    fetchStoresData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'storeId' && value) {
      // If store is selected, update store-related fields
      const selectedStore = stores && Array.isArray(stores) ? 
        stores.find(store => store._id === value) : null;
      
      if (selectedStore) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          storeName: selectedStore.name,
          storeSlug: selectedStore.slug
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Current form data:', formData);

    // Validate form data
    const newErrors = { ...errors };
    let hasErrors = false;

    if (!formData.title) {
      newErrors.title = 'Title is required';
      hasErrors = true;
    }

    if (!formData.code && formData.type === 'Code') {
      newErrors.code = 'Code is required for coupon codes';
      hasErrors = true;
    }

    if (!formData.label) {
      newErrors.label = 'Label is required';
      hasErrors = true;
    }

    if (!formData.storeId) {
      newErrors.storeId = 'Store is required';
      hasErrors = true;
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.startDate = 'Start date cannot be after end date';
      newErrors.endDate = 'End date cannot be before start date';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      console.log('Validation errors:', newErrors);
      return;
    }

    try {
      setLoading(true);
      console.log('Preparing submission data...');
      
      // Get store info if storeId is selected
      const selectedStore = stores && Array.isArray(stores) && formData.storeId ? 
        stores.find(store => store._id === formData.storeId) : null;
      
      console.log('Selected store:', selectedStore);

      // Prepare data for submission, mapping fields correctly
      const couponData = {
        offerId: coupon?.offerId || `admin-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        title: formData.title,
        description: formData.description || '',
        code: formData.code || '',
        type: formData.type,
        store: selectedStore?.name || formData.storeName || '',
        storeId: formData.storeId,
        storeSlug: selectedStore?.slug || formData.storeSlug || '',
        url: formData.url || '',
        affiliateLink: formData.affiliateLink || '',
        imageUrl: formData.imageUrl || '',
        brandLogo: formData.brandLogo || '',
        label: formData.label || '',
        featured: formData.featured,
        status: formData.status,
        isActive: formData.isActive,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        rating: Number(formData.rating) || 5
      };

      // Log the data being sent for debugging
      console.log('Submitting coupon update:', couponData);

      console.log('Sending API request...');
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(couponData)
      });

      console.log('API Response status:', res.status);
      const data = await res.json();
      console.log('API Response data:', data);
      
      if (!res.ok) {
        console.error('Error response:', data);
        throw new Error(data.message || 'Failed to update coupon');
      }

      if (data.success) {
        console.log('Update successful, redirecting...');
        toast.success('Coupon updated successfully');
        router.push('/admin/coupons');
      } else {
        throw new Error(data.message || 'Failed to update coupon');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete coupon');
      }

      const data = await res.json();
      if (data.success) {
        toast.success('Coupon deleted successfully');
        router.push('/admin/coupons');
      } else {
        throw new Error(data.message || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (loadingCoupon || loadingStores) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" text="Loading coupon details..." />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Coupon not found</div>
        <button
          onClick={() => router.push('/admin/coupons')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Coupons
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900" >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Coupon</h1>
        <button
          onClick={() => router.push('/admin/coupons')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Coupons
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Code">Code</option>
              <option value="Deal">Deal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Store</label>
            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a store</option>
              {stores && Array.isArray(stores) && stores.map(store => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
            {errors.storeId && <p className="text-red-500 text-sm mt-1">{errors.storeId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Affiliate Link</label>
            <input
              type="url"
              name="affiliateLink"
              value={formData.affiliateLink}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Logo</label>
            <input
              type="url"
              name="brandLogo"
              value={formData.brandLogo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Featured</label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min={1}
              max={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Coupon'}
          </button>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Coupon
          </button>
        </div>
      </form>

      {deleteModalOpen && (
        <div className="fixed inset-0 text-gray-900  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Coupon</h2>
            <p className="mb-4">Are you sure you want to delete this coupon? This action cannot be undone.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}