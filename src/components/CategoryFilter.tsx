'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  tags?: string[];
  icon?: string;
  image?: string;
}

interface CategoryFilterProps {
  className?: string;
}

export default function CategoryFilter({ className = '' }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
        
        // Filter out parent categories (those without a parentCategory)
        const parents = data.categories.filter((cat: Category) => !cat.parentCategory);
        setParentCategories(parents);
        
        // Check if there's a category in the URL
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [searchParams]);

  const handleCategoryClick = (slug: string) => {
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or add the category parameter
    params.set('category', slug);
    
    // Reset to page 1 when changing category
    params.set('page', '1');
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
    
    // Update selected category
    setSelectedCategory(slug);
  };

  const clearFilter = () => {
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove the category parameter
    params.delete('category');
    
    // Reset to page 1
    params.set('page', '1');
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
    
    // Clear selected category
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className={`${className} p-4 bg-white rounded-lg shadow-md animate-pulse`}>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} p-4 bg-white rounded-lg shadow-md`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <div className={`${className} p-4 bg-white text-gray-800 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      
      <div className="space-y-2">
        {selectedCategory && (
          <button
            onClick={clearFilter}
            className="text-blue-600 text-sm mb-2 flex items-center"
          >
            <span className="mr-1">×</span> Clear filter
          </button>
        )}
        
        <ul className="space-y-1">
          {parentCategories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            const childCategories = categories.filter(
              (cat) => cat.parentCategory === category._id
            );
            
            return (
              <li key={category._id} className="mb-2">
                <button
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`text-left w-full hover:text-blue-600 ${isSelected ? 'font-semibold text-blue-600' : ''}`}
                >
                  {category.name}
                </button>
                
                {childCategories.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {childCategories.map((child) => {
                      const isChildSelected = selectedCategory === child.slug;
                      return (
                        <li key={child._id}>
                          <button
                            onClick={() => handleCategoryClick(child.slug)}
                            className={`text-left text-sm hover:text-blue-600 ${isChildSelected ? 'font-semibold text-blue-600' : ''}`}
                          >
                            {child.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}