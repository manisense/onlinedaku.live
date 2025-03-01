'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import BlogPagination from './BlogPagination';
import { IBlog } from '@/types/blog';
import Loader from '../ui/Loader';

interface BlogListProps {
  initialBlogs: IBlog[];
  totalPages: number;
}


export default function BlogList({ initialBlogs, totalPages }: BlogListProps) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blogs?page=${page}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size='large' text='Loading blogs..' />
      </div>
      
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blog/${blog.slug}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full h-48">
              {blog.coverImage ? (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Online Daku</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 2 && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      +{blog.tags.length - 2}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {dayjs(blog.createdAt).format('MMM D, YYYY')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
