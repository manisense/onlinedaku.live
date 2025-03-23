import Image from 'next/image';
import { FaGift } from 'react-icons/fa';
import Link from 'next/link';

interface FreebieCardProps {
  freebie: {
    title: string;
    description: string;
    store: string;
    image: string;
    link: string;
    id?: string;
  };
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default function FreebieCard({ freebie }: FreebieCardProps) {
  return (
    <div className="space-y-8">
      <Link href={freebie.id ? `/freebies/${freebie.id}` : '#'} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
          <div className="relative h-48 w-full">
            <Image
              src={freebie.image}
              alt={freebie.title}
              fill
              unoptimized={true}
              className="object-contain"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                e.currentTarget.src = '/freebies.png';
              }}
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              FREE
            </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
              {truncateText(freebie.title, 60)}
            </h3>
            <p className="text-gray-600 mb-4 text-sm line-clamp-3">
              {truncateText(freebie.description, 150)}
            </p>
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm">{freebie.store}</span>
              </div>
              <button
                onClick={() => {
                  window.open(freebie.link, '_blank', 'noopener,noreferrer');
                }}
                className="bg-green-600 text-white w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >
                <FaGift />
                Get it Free
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}