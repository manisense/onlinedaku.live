'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface Deal {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string; // This will be the category ID
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  couponCode?: string;
}

type DealFormData = Omit<Deal, '_id'>;

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DealFormData) => Promise<void>;
  deal?: Deal | null;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export default function DealModal({ isOpen, onClose, onSubmit, deal }: DealModalProps) {
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    description: '',
    store: '',
    category: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isActive: true,
    couponCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        description: deal.description,
        store: deal.store,
        category: deal.category,
        discountType: deal.discountType,
        discountValue: deal.discountValue,
        startDate: new Date(deal.startDate).toISOString().split('T')[0],
        endDate: new Date(deal.endDate).toISOString().split('T')[0],
        isActive: deal.isActive,
        couponCode: deal.couponCode || ''
      });
    }
  }, [deal]);

  useEffect(() => {
    const fetchCategories = async () => {
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
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
      if (!deal) {
        // Reset form only for new deals
        setFormData({
          title: '',
          description: '',
          store: '',
          category: '',
          discountType: 'percentage',
          discountValue: 0,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          isActive: true,
          couponCode: ''
        });
      }
    } catch (error: unknown) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Failed to save deal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 text-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{deal ? 'Edit Deal' : 'Add New Deal'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              name="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={handleChange}
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Store</label>
            <input
              type="text"
              required
              value={formData.store}
              onChange={handleChange}
              name="store"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={handleChange}
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={loadingCategories}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {loadingCategories && <p className="text-sm text-gray-500 mt-1">Loading categories...</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={handleChange}
                name="discountType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Value</label>
              <input
                type="number"
                required
                min="0"
                value={formData.discountValue}
                onChange={handleChange}
                name="discountValue"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={handleChange}
                name="startDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={handleChange}
                name="endDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Coupon Code (Optional)</label>
            <input
              type="text"
              value={formData.couponCode}
              onChange={handleChange}
              name="couponCode"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}