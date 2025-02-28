'use client';

import { useState, useEffect } from 'react';
//import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';
import dayjs from 'dayjs';
import Loader from '@/components/ui/Loader';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
 // const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/blogs?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blogs');
      }
      
      setBlogs(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete blog');
      }
      
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  return (

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-indigo-600 font-bold">Manage Blogs</h1>
          <Link 
            href="/admin/blogs/create" 
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> New Blog Post
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
           <Loader size='medium' text='Loading blogs...' />
           </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No blog posts found.</p>
            <Link 
              href="/admin/blogs/create" 
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
            >
              Create your first blog post
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/blogs/edit/${blog._id}`} className="font-medium text-indigo-600 hover:underline">
                          {blog.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dayjs(blog.createdAt).format('MMM D, YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/blog/${blog.slug}`}
                          className="text-gray-500 hover:text-gray-700 mx-2"
                          target="_blank"
                        >
                          <FaEye />
                        </Link>
                        <Link 
                          href={`/admin/blogs/edit/${blog._id}`}
                          className="text-indigo-600 hover:text-indigo-900 mx-2"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => deleteBlog(blog._id)}
                          className="text-red-600 hover:text-red-900 mx-2"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md mr-2 bg-white border disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md mx-1 ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md ml-2 bg-white border disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

  );
}
