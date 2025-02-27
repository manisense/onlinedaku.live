'use client';

import React from 'react';
import { FaTimes, FaExternalLinkAlt, FaTag } from 'react-icons/fa';
import Image from 'next/image';

interface Deal {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  couponCode?: string;
  image?: string;
  link?: string;
}

interface DealPreviewProps {
  deal: Deal;
  onClose: () => void;
}

export default function DealPreview({ deal, onClose }: DealPreviewProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Deal Preview</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image preview */}
            <div className="flex justify-center items-start">
              {deal.image ? (
                <div className="relative w-full pt-[100%] bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/product-placeholder.png';
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-200 rounded-md w-full pt-[100%] relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                </div>
              )}
            </div>
            
            {/* Deal details */}
            <div>
              <h2 className="text-xl font-bold mb-2">{deal.title}</h2>
              
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                  {deal.store}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {deal.category}
                </span>
              </div>
              
              <div className="flex items-baseline mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  {deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `₹${deal.discountValue} OFF`}
                </div>
                {deal.couponCode && (
                  <div className="ml-3 flex items-center bg-green-50 px-2 py-1 rounded border border-green-200">
                    <FaTag className="text-green-600 mr-1" size={12} />
                    <span className="text-green-800 text-sm font-medium">{deal.couponCode}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-4 text-sm text-gray-600">
                <div className="mb-2"><strong>Valid:</strong> {formatDate(deal.startDate)} to {formatDate(deal.endDate)}</div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  deal.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {deal.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              {deal.link && (
                <a 
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mb-4 text-indigo-600 hover:text-indigo-800"
                >
                  View Product <FaExternalLinkAlt size={12} className="ml-1" />
                </a>
              )}
              
              <div className="mt-4">
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {deal.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}