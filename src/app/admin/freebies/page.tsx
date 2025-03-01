'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';
import dayjs from 'dayjs';
import Loader from '@/components/ui/Loader';

interface Freebie {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string;
  image: string;
  link: string;
  termsAndConditions: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function AdminFreebies() {
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFreebies();
  }, [currentPage]);

  const fetchFreebies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/freebies?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch freebies');
      }
      
      setFreebies(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Error fetching freebies:', error);
      toast.error('Failed to load freebies');
    } finally {
      setLoading(false);
    }
  };

  const deleteFreebie = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this freebie?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/freebies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete freebie');
      }
      
      toast.success('Freebie deleted successfully');
      fetchFreebies();
    } catch (error) {
      console.error('Error deleting freebie:', error);
      toast.error('Failed to delete freebie');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-indigo-600 font-bold">Manage Freebies</h1>
        <Link 
          href="/admin/freebies/create" 
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> New Freebie
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="large" text="Loading Freebies..." />
        </div>
      ) : freebies.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">No freebies found.</p>
          <Link 
            href="/admin/freebies/create" 
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Create your first freebie
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
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Till
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {freebies.map((freebie) => (
                  <tr key={freebie._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/freebies/edit/${freebie._id}`} className="font-medium text-indigo-600 hover:underline">
                        {freebie.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {freebie.store}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {freebie.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${freebie.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {freebie.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayjs(freebie.endDate).format('MMM D, YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/freebies/${freebie._id}`}
                        className="text-gray-500 hover:text-gray-700 mx-2"
                        target="_blank"
                      >
                        <FaEye />
                      </Link>
                      <Link 
                        href={`/admin/freebies/edit/${freebie._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => deleteFreebie(freebie._id)}
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
                      className={`px-3 py-1 rounded-md mx-1 ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
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