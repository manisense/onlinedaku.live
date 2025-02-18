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
  store: string;
  expiresAt: string;
  link: string;
}

const FeaturedDeals = () => {
  // This would typically come from an API or database
  const featuredDeals: Deal[] = [
    {
      id: '1',
      title: 'Sony WH-1000XM4 Headphones',
      description: 'Industry-leading noise canceling with Dual Noise Sensor',
      imageUrl: '/headphones.jpg',
      price: 278,
      originalPrice: 349,
      discount: 20,
      store: 'Amazon',
      expiresAt: '2024-02-01',
      link: '/deals/sony-headphones'
    },
    {
      id: '2',
      title: 'Nintendo Switch OLED',
      description: 'Latest Nintendo Switch with vibrant 7-inch OLED screen',
      imageUrl: '/switch.jpg',
      price: 299,
      originalPrice: 349,
      discount: 15,
      store: 'Best Buy',
      expiresAt: '2024-02-03',
      link: '/deals/nintendo-switch'
    },
    {
      id: '3',
      title: 'Samsung 65" 4K Smart TV',
      description: 'Crystal UHD, HDR, with built-in voice assistants',
      imageUrl: '/samsung-tv.jpg',
      price: 599,
      originalPrice: 799,
      discount: 25,
      store: 'Walmart',
      expiresAt: '2024-02-05',
      link: '/deals/samsung-tv'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={deal.imageUrl}
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg">
                  {deal.discount}% OFF
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                  <span className="text-sm text-gray-500">{deal.store}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{deal.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${deal.price}</p>
                    <p className="text-sm text-gray-500 line-through">${deal.originalPrice}</p>
                  </div>
                  <Link
                    href={deal.link}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Deal
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-4">Expires: {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(deal.expiresAt))}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;