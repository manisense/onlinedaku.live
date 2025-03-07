import Image from 'next/image';
import { FaTag, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    discountValue: number;
    image: string;
    link: string;
    id?: string;
    category?: {
      _id: string;
      name: string;
      slug: string;
    };
  };
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="h-full">
      <Link href={product.id ? `/deals/${product.id}` : '#'} className="block h-full">
        <div 
          className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 flex flex-col h-full relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
        >
          {/* Discount Badge */}
          {product.discountValue > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <FaTag className="mr-1" size={10} />
                {product.discountValue}% OFF
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-3 left-3 z-10">
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/deals?category=${product?.category?.slug}`;
                }}
                className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors cursor-pointer"
              >
                {product.category.name}
              </div>
            </div>
          )}
          
          {/* Image Container */}
          <div className="relative h-48 w-full overflow-hidden bg-gray-50">
            <Image
              src={imageError ? '/product-placeholder.png' : product.image}
              alt={product.title}
              fill
              unoptimized={true}
              className="object-contain transition-transform duration-300 p-2"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          
          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors">
              {truncateText(product.title, 60)}
            </h3>
            
            <p className="text-gray-600 mb-4 text-sm line-clamp-3">
              {truncateText(product.description, 150)}
            </p>
            
            <div className="mt-auto">
              {/* Price Section */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-gray-500 line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
                  </>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href={product.id ? `/deals/${product.id}` : '#'} 
                  className="bg-indigo-100 text-indigo-700 py-2 px-4 rounded-md flex items-center justify-center gap-1 hover:bg-indigo-200 transition-colors text-sm font-medium"
                >
                  View Details
                </Link>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(product.link, '_blank', 'noopener,noreferrer');
                  }}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <FaExternalLinkAlt size={12} />
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
