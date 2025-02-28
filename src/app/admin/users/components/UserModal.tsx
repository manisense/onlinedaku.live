'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

// For creating users
type NewUserData = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
};

// For updating users
type UpdateUserData = Partial<Omit<User, '_id' | 'createdAt'>> & { password?: string };

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ((data: NewUserData) => Promise<void>) | ((data: UpdateUserData) => Promise<void>);
  user?: User | null;
}

export default function UserModal({ isOpen, onClose, onSubmit, user }: UserModalProps) {
  const [formData, setFormData] = useState<NewUserData>({
    name: '',
    email: '',
    password: '',
    isActive: true,
    isVerified: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
        isVerified: typeof user.isVerified === 'boolean' ? user.isVerified : false
      });
    } else {
      // Reset form for new users
      setFormData({
        name: '',
        email: '',
        password: '',
        isActive: true,
        isVerified: false
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required');
      }

      if (!user && !formData.password) {
        throw new Error('Password is required for new users');
      }

      // When editing, only send fields that are actually changed
      if (user) {
        const updatedFields: UpdateUserData = {};
        
        if (formData.name !== user.name) updatedFields.name = formData.name;
        if (formData.email !== user.email) updatedFields.email = formData.email;
        if (formData.isActive !== user.isActive) updatedFields.isActive = formData.isActive;
        if (formData.isVerified !== user.isVerified) updatedFields.isVerified = formData.isVerified;
        if (formData.password) updatedFields.password = formData.password;
        
        // Type assertion to help TypeScript understand the function signature
        (onSubmit as (data: UpdateUserData) => Promise<void>)(updatedFields);
      } else {
        // For new users, submit all fields
        // Type assertion for new user submission
        (onSubmit as (data: NewUserData) => Promise<void>)(formData);
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{user ? 'Edit User' : 'Add New User'}</h3>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password {user ? '(Leave blank to keep unchanged)' : ''}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required={!user}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active Account
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isVerified"
              id="isVerified"
              checked={formData.isVerified}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-700">
              Email Verified
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
