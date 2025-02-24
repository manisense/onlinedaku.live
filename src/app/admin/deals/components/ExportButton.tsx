'use client';

import { useState } from 'react';
import { FaFileExport } from 'react-icons/fa';
import { convertToCSV, downloadCSV } from '@/utils/exportUtils';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/deals/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export deals');
      }

      const data = await response.json();
      const fields = [
        'title',
        'store',
        'category',
        'discountType',
        'discountValue',
        'startDate',
        'endDate',
        'isActive',
        'couponCode',
        'views',
        'clicks',
        'conversions',
        'conversionRate'
      ];

      const csv = convertToCSV(data.deals, fields);
      downloadCSV(csv, `deals-export-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export deals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
    >
      <FaFileExport className="mr-2" />
      {loading ? 'Exporting...' : 'Export'}
    </button>
  );
} 