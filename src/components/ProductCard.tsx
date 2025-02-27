import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  product: {
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    discountValue: number;
    image: string;
    link: string;
  };
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {truncateText(product.title, 60)}
        </h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {truncateText(product.description, 150)}
        </p>
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold">₹{product.price}</span>
            <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
            <span className="text-green-600 text-sm">({product.discountValue}% off)</span>
          </div>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <FaShoppingCart />
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
