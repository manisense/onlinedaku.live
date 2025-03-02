"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Loader from '../ui/Loader';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  isActive: boolean;
}

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories?activeOnly=true');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <section className="py-3 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader size="medium" text="Loading categories..." />
          </div>
        ) : (
          <div className="grid text-gray-800 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${activeCategory === category._id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setActiveCategory(category._id)}
              >
                <span className="text-xl mb-2">{category.icon || '📦'}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;