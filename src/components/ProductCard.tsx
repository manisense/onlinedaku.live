import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

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
  //const [recommendedDeals, setRecommendedDeals] = useState<ProductCardProps['product'][]>([]);

  // useEffect(() => {
  //   const fetchRecommendedDeals = async () => {
  //     try {
  //       const response = await fetch(`/api/deals/recommended?excludeId=${product.id || ''}&limit=4`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setRecommendedDeals(data.deals || []);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching recommended deals:', error);
  //     }
  //   };

  //   fetchRecommendedDeals();
  // }, [product.id]);
  return (
    <div className="space-y-8">
      <Link href={product.id ? `/deals/${product.id}` : '#'} className="block">
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
              {product.category && (
                <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/deals?category=${product?.category?.slug}`;
                  }}
                  className="inline-block mb-2 cursor-pointer"
                >
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full hover:bg-gray-200">
                    {product.category.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold">₹{product.price}</span>
                <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                <span className="text-green-600 text-sm">({product.discountValue}% off)</span>
              </div>
              <button
                onClick={() => {
                  window.open(product.link, '_blank', 'noopener,noreferrer');
                }}
                className="bg-blue-600 text-white w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <FaShoppingCart />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>

     
    </div>
  );
}
