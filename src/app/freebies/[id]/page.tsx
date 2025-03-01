'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaGift, FaClock, FaStore, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import FreebieCard from '@/components/FreebieCard';
import Loader from '@/components/ui/Loader';

interface Freebie {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string;
  image: string;
  link: string;
  termsAndConditions: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface RecommendedFreebie {
  _id: string;
  title: string;
  description: string;
  store: string;
  image: string;
  link: string;
}

export default function FreebieDetailPage() {
  const params = useParams() as { id: string };
  const freebieId = params.id;
  
  const [freebie, setFreebie] = useState<Freebie | null>(null);
  const [recommendedFreebies, setRecommendedFreebies] = useState<RecommendedFreebie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate time remaining
  const calculateTimeRemaining = (endDate: string): string => {
    const end = new Date(endDate);
    const now = new Date();
    
    if (now > end) return 'Expired';
    
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    }
    
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
  };

  useEffect(() => {
    const fetchFreebie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/freebies/${freebieId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch freebie details');
        }
        
        const data = await response.json();
        setFreebie(data.freebie);
        
        // Fetch random recommended freebies
        try {
          const recommendedResponse = await fetch(`/api/freebies/recommended?limit=4&excludeId=${freebieId}`);
          if (recommendedResponse.ok) {
            const recommendedData = await recommendedResponse.json();
            setRecommendedFreebies(recommendedData.freebies || []);
          }
        } catch (recErr) {
          console.error('Failed to fetch recommended freebies:', recErr);
        }
      } catch (err) {
        setError('Failed to load freebie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (freebieId) {
      fetchFreebie();
    }
  }, [freebieId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
 <Loader size='large'  text='Loading...' />
      </div>
    );
  }

  if (error || !freebie) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4 text-xl">{error || 'Freebie not found'}</div>
        <Link
          href="/freebies"
          className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaArrowLeft className="mr-2" />
          Back to Freebies
        </Link>
      </div>
    );
  }

  const isExpired = new Date() > new Date(freebie.endDate);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link
              href="/freebies"
              className="inline-flex items-center text-green-600 hover:text-green-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Freebies
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="bg-gray-100 p-6 flex items-center justify-center">
                <div className="relative h-80 w-full">
                  {freebie.image ? (
                    <Image
                      src={freebie.image}
                      alt={freebie.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      priority
                      onError={(e) => {
                        e.currentTarget.src = '/product-placeholder.png';
                      }}
                    />
                  ) : (
                    <Image 
                      src="/product-placeholder.svg" 
                      alt="No image available"
                      width={300}
                      height={300}
                      className="mx-auto"
                    />
                  )}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center mb-4 space-x-2">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    <FaGift className="inline mr-1" />
                    FREE
                  </span>
                  
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                    {freebie.category}
                  </span>
                  
                  {!isExpired ? (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      <FaClock className="inline mr-1" />
                      {calculateTimeRemaining(freebie.endDate)}
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                      <FaClock className="inline mr-1" />
                      Expired
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {freebie.title}
                </h1>
                
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <FaStore className="mr-1" />
                    {freebie.store}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{freebie.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="text-sm text-gray-500">Valid From</div>
                      <div className="font-medium">{formatDate(freebie.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Valid Till</div>
                      <div className="font-medium">{formatDate(freebie.endDate)}</div>
                    </div>
                  </div>
                </div>

                {freebie.termsAndConditions && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Terms & Conditions
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {freebie.termsAndConditions}
                    </p>
                  </div>
                )}
                
                <div>
                  <a
                    href={freebie.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center text-center py-3 px-4 rounded-md text-white font-medium transition-colors ${isExpired ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={(e) => {
                      if (isExpired) {
                        e.preventDefault();
                        alert('This freebie has expired.');
                      }
                    }}
                  >
                    <FaGift className="mr-2" />
                    {isExpired ? 'Offer Expired' : 'Get it Free'}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommended Freebies Section */}
          {recommendedFreebies.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Free Offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendedFreebies.map((recFreebie) => (
                  <FreebieCard
                    key={recFreebie._id}
                    freebie={{
                      id: recFreebie._id,
                      title: recFreebie.title,
                      description: recFreebie.description,
                      store: recFreebie.store,
                      image: recFreebie.image,
                      link: recFreebie.link
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}