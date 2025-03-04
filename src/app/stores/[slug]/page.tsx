"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/ui/Loader';

interface Store {
  _id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
  slug: string;
  rating?: number;
}

// Update this interface to match what your ProductCard component expects
interface Deal {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  store: string; // This is the slug/name of the store, not an object
  category: string; // This is the category slug/name
  discountType: string;
  discountValue: number;
  link: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  isActive: boolean;
  slug?: string;
}

// Define the interface for what ProductCard expects
interface ProductCardProps {
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
  // Add store property if needed by ProductCard
  store?: {
    _id: string;
    name: string;
    logo: string;
  };
  slug?: string;
}

export default function StorePage() {
  const params = useParams();
  const { slug } = params;
  
  const [store, setStore] = useState<Store | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch store details
        const storeResponse = await fetch(`/api/stores/${slug}`);
        
        if (!storeResponse.ok) {
          const errorData = await storeResponse.json();
          throw new Error(errorData.message || 'Failed to fetch store details');
        }
        
        const storeData = await storeResponse.json();
        
        if (!storeData.success) {
          throw new Error(storeData.message || 'Failed to fetch store details');
        }
        
        setStore(storeData.data);
        
        // Fetch store's deals
        const dealsResponse = await fetch(`/api/stores/${slug}/deals`);
        
        if (!dealsResponse.ok) {
          const errorData = await dealsResponse.json();
          console.warn('Issue fetching deals:', errorData.message);
          // We'll continue even if deals fail to load
          setDeals([]);
        } else {
          const dealsData = await dealsResponse.json();
          if (dealsData.success) {
            setDeals(dealsData.data || []);
          } else {
            setDeals([]);
          }
        }
      } catch (err: unknown) {
        console.error('Error fetching store data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the store');
        setStore(null);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStoreDetails();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader size="large" text="Loading store details..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !store) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-900">
                {error ? 'Error' : 'Store not found'}
              </h2>
              <p className="mt-2 text-gray-600">
                {error || "The store you're looking for doesn't exist or has been removed."}
              </p>
              <div className="mt-6">
                <a
                  href="/stores"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View All Stores
                </a>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Store Header */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6 sm:p-8 md:flex items-start space-x-0 md:space-x-8">
              <div className="flex-shrink-0 bg-gray-100 p-4 rounded-md mb-6 md:mb-0 flex items-center justify-center" style={{ height: '160px', width: '160px' }}>
                <Image
                  src={store.logo || '/product-placeholder.png'}
                  alt={store.name}
                  width={140}
                  height={140}
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.src = '/product-placeholder.png';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                  {store.rating && (
                    <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
                      <span className="text-indigo-600 font-medium">{store.rating} ★</span>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-gray-600">{store.description}</p>
                <div className="mt-6">
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Visit Official Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Deals Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Deals from {store.name}</h2>
            
            {deals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">No active deals available from this store at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {deals.map((deal) => {
                  // Create a properly typed object for ProductCard
                  const productProps: ProductCardProps = {
                    title: deal.title,
                    description: deal.description,
                    price: deal.price,
                    originalPrice: deal.originalPrice,
                    discountValue: deal.discountValue,
                    image: deal.image,
                    link: deal.link,
                    id: deal._id,
                    category: {
                      _id: deal.category,
                      name: deal.category,
                      slug: deal.category
                    },
                    store: {
                      _id: store._id,
                      name: store.name,
                      logo: store.logo
                    },
                    slug: deal.slug || deal._id
                  };
                  
                  return <ProductCard key={deal._id} product={productProps} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}