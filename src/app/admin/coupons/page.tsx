'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import Loader from '@/components/ui/Loader';

interface Coupon {
  _id: string;
  title: string;
  description: string;
  type: 'couponcode' | 'offer';
  code: string;
  store: string;
  website: string;
  expiryDate: Date;
  isActive: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCoupons();
  }, [currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/coupons?page=${currentPage}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        setCoupons(data.coupons);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.error || 'Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-indigo-800 font-bold">Coupons</h1>
        <Link
          href="/admin/coupons/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FaPlus size={14} />
          Add New Coupon
        </Link>
      </div>

      {loading ? (
         <Loader size='large'  text='Loading...' />
      ) : (
        <div className="bg-white text-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm max-w-[120px] truncate">{coupon.title}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap capitalize">{coupon.type}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    {coupon.type === 'couponcode' ? <span className="font-mono">{coupon.code}</span> : 'Offer Activated'}
                  </td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">{coupon.store}</td>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded text-xs inline-flex items-center"
                      >
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link
                        href={`/admin/coupons/edit/${coupon._id}`}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs inline-flex items-center"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex justify-between w-full">
                <div className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white disabled:opacity-50" 
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}