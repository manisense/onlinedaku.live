'use client';

import { FaTag, FaClock, FaStore, FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect } from 'react';

interface DealPreviewProps {
  deal: {
    title: string;
    description: string;
    store: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
    couponCode?: string;
  };
  onClose: () => void;
}

export default function DealPreview({ deal, onClose }: DealPreviewProps) {
  const trackView = async () => {
    try {
      const response = await fetch(`/api/deals/${deal._id}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'view' }),
      });
      if (!response.ok) {
        throw new Error('Failed to track view');
      }
    } catch (error) {
      console.error('View tracking error:', error);
    }
  };

  const trackClick = async () => {
    try {
      const response = await fetch(`/api/deals/${deal._id}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'click' }),
      });
      if (!response.ok) {
        throw new Error('Failed to track click');
      }
    } catch (error) {
      console.error('Click tracking error:', error);
    }
  };

  useEffect(() => {
    trackView();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Deal Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <FaExternalLinkAlt />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{deal.title}</h2>
          
          <div className="flex items-center text-gray-600 mb-4">
            <FaStore className="mr-2" />
            <span>{deal.store}</span>
            <FaTag className="ml-6 mr-2" />
            <span>
              {deal.discountType === 'percentage' 
                ? `${deal.discountValue}% OFF`
                : `$${deal.discountValue} OFF`}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{deal.description}</p>

          {deal.couponCode && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={deal.couponCode}
                  className="flex-1 block rounded-l-md border-gray-300 bg-gray-50"
                />
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(deal.couponCode!);
                    trackClick();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-2" />
            <span>
              Valid from {new Date(deal.startDate).toLocaleDateString()} to{' '}
              {new Date(deal.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
} 