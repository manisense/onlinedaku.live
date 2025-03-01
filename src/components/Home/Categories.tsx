"use client"

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { id: 'electronics', name: 'Electronics', icon: '🔌' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'home', name: 'Home & Living', icon: '🏠' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'travel', name: 'Travel', icon: '✈️' }
];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section className="py-3 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid text-gray-800 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${activeCategory === category.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="text-xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;