import Image from 'next/image';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  discount: number;
  link: string;
}

const HeroSection = () => {
  // This would typically come from an API or database
  const featuredDeal: Deal = {
    id: '1',
    title: 'Latest MacBook Pro M2',
    description: 'Get the powerful MacBook Pro with M2 chip at the lowest price ever!',
    imageUrl: '/macbook-pro.jpg', // You'll need to add this image to public folder
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    link: '/deals/macbook-pro-m2'
  };

  return (
    <div className="relative bg-gray-900">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Top Deal of the Day</span>
              <span className="block text-indigo-400">{featuredDeal.discount}% OFF</span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              {featuredDeal.description}
            </p>
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <div className="text-white">
                <p className="text-lg font-semibold">Special Price</p>
                <p className="text-3xl font-bold">${featuredDeal.price}</p>
                <p className="text-gray-400 line-through">${featuredDeal.originalPrice}</p>
              </div>
              <Link 
                href={featuredDeal.link}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Grab Deal
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={featuredDeal.imageUrl}
              alt={featuredDeal.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;