import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaRegCopy, FaCalendarAlt, FaTag, FaCheckCircle, FaExternalLinkAlt, FaPercent } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Coupon {
  _id: string;
  offerId: string;
  title: string;
  description: string;
  code: string;
  featured: boolean;
  source: string;
  url: string;
  affiliateLink: string;
  imageUrl: string;
  brandLogo: string;
  type: string;
  store: string;
  startDate: string | null;
  endDate: string | null;  // Made nullable to handle missing dates
  status: string;
  rating: number;
  label: string;
  isActive: boolean;
  storeSlug: string;
  discountValue?: number;
}

interface CouponCardProps {
  coupon: Coupon;
  showStore?: boolean;
}

export default function CouponCard({ coupon, showStore = true }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        toast.success('Coupon code copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        toast.error('Failed to copy code');
      });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No expiration';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'No expiration';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error);
      return 'No expiration';
    }
  };

  const handleTrackClick = () => {
    // Send tracking analytics (if you have analytics set up)
    try {
      console.log(`Coupon clicked: ${coupon.offerId}`);
      
      // You could implement a proper tracking API call here
      // Example: fetch('/api/track', { method: 'POST', body: JSON.stringify({ couponId: coupon.offerId }) })
    } catch (err) {
      console.error('Error tracking coupon click:', err);
    }
  };

  // Get proper destination link
  const destinationLink = coupon.affiliateLink || coupon.url;
  
  // Format discount value if available
  const discountDisplay = coupon.discountValue 
    ? `${coupon.discountValue}% OFF` 
    : coupon.label || (coupon.type === 'Code' ? 'Coupon Code' : 'Deal');

  // Determine if coupon is about to expire (within 3 days)
  const isAboutToExpire = () => {
    if (!coupon.endDate) return false;
    const endDate = new Date(coupon.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 3 && diffDays > 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      {/* Top Ribbon for Featured or Expiring Soon */}
      {(coupon.featured || isAboutToExpire()) && (
        <div className={`py-1 px-3 text-center text-xs font-bold text-white ${coupon.featured ? 'bg-indigo-600' : 'bg-orange-500'}`}>
          {coupon.featured ? 'FEATURED DEAL' : 'EXPIRES SOON'}
        </div>
      )}
      
      {/* Store Header */}
      {showStore && (
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            {coupon.brandLogo ? (
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                <Image
                  src={coupon.brandLogo}
                  alt={coupon.store}
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.src = '/coupon.png';
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                <span className="text-sm font-medium text-gray-600">{coupon.store.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{coupon.store}</h3>
              <Link 
                href={`/stores/${coupon.storeSlug}`}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                View all deals
              </Link>
            </div>
          </div>
          <div className="bg-indigo-100 px-2 py-1 rounded-full flex items-center">
            <FaTag className="text-indigo-600 mr-1 h-3 w-3" />
            <span className="text-xs font-medium text-indigo-800">{coupon.type}</span>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-4">
        {/* Discount Badge */}
        <div className="mb-3 flex items-center">
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium flex items-center">
            {coupon.discountValue && <FaPercent className="mr-1 h-3 w-3" />}
            {discountDisplay}
          </span>
        </div>
        
        {/* Title and Description */}
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{coupon.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{coupon.description}</p>
        
       
        
        {/* Coupon Code */}
        {coupon.code && (
          <div className="flex items-center justify-between p-3 mb-4 bg-gray-50 border border-dashed border-gray-300 rounded-md hover:border-indigo-300 transition-colors">
            <span className="font-mono font-medium text-gray-800">{coupon.code}</span>
            <button 
              onClick={() => handleCopyCode(coupon.code)} 
              className={`${copied ? 'text-green-600' : 'text-indigo-600 hover:text-indigo-800'} flex items-center`}
              aria-label="Copy code"
              title="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <FaCheckCircle size={16} className="mr-1" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <>
                  <FaRegCopy size={16} className="mr-1" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <a
            href={destinationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTrackClick}
            className="flex-1 text-center px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
          >
            <span className="mr-2">{coupon.type === 'Code' ? 'Use Code' : 'Get Deal'}</span>
            <FaExternalLinkAlt size={14} />
          </a>
        </div>
        
        {/* Metrics - Optional */}
        {coupon.rating > 0 && (
          <div className="mt-3 flex items-center justify-center">
            <div className="text-xs text-gray-500 flex items-center">
              <span className="flex">
                {[...Array(Math.round(coupon.rating))].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {[...Array(5 - Math.round(coupon.rating))].map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
              </span>
              <span className="ml-1">({coupon.rating.toFixed(1)})</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2.5 bg-gray-50 text-xs text-gray-500 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-center">
          <span className="inline-block">Source: {coupon.source || 'Unknown'}</span>
        </div>
        {coupon.endDate && (
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1 h-3 w-3" />
            <span>
              Expires: {formatDate(coupon.endDate)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
