'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import Loader from '../ui/Loader';

interface Freebie {
  _id: string;
  title: string;
  image: string;
  store: string;
  link: string;
}

const FreebieCard: React.FC<Freebie> = ({ title, image, store, link }) => {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <div className="relative h-28">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = '/freebies.png';
            }}
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            FREE
          </div>
        </div>
        <div className="p-2">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-600">{store}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FreebiesSection: React.FC = () => {
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreebies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/freebies?limit=8&isActive=true');
        if (!response.ok) {
          throw new Error('Failed to fetch freebies');
        }
        const data = await response.json();
        if (data.freebies && Array.isArray(data.freebies)) {
          setFreebies(data.freebies);
        } else {
          throw new Error('Invalid freebies data format');
        }
      } catch (err) {
        console.error('Error fetching freebies:', err);
        setFreebies([
          {
            _id: '1',
            title: 'Free Amazon Prime Trial',
            image: '/images/products/prime.jpg',
            store: 'Amazon',
            link: '/freebies/1'
          },
          {
            _id: '2',
            title: 'Netflix Free Month',
            image: '/images/products/netflix.jpg',
            store: 'Netflix',
            link: '/freebies/2'
          },
          {
            _id: '3',
            title: 'Spotify Premium Trial',
            image: '/images/products/spotify.jpg',
            store: 'Spotify',
            link: '/freebies/3'
          },
          {
            _id: '4',
            title: 'Audible Free Audiobook',
            image: '/images/products/audible.jpg',
            store: 'Audible',
            link: '/freebies/4'
          },
          {
            _id: '5',
            title: 'YouTube Premium Trial',
            image: '/images/products/youtube.jpg',
            store: 'YouTube',
            link: '/freebies/5'
          },
          {
            _id: '6',
            title: 'Canva Pro Free Trial',
            image: '/images/products/canva.jpg',
            store: 'Canva',
            link: '/freebies/6'
          },
          {
            _id: '7',
            title: 'Grammarly Premium Trial',
            image: '/images/products/grammarly.jpg',
            store: 'Grammarly',
            link: '/freebies/7'
          },
          {
            _id: '8',
            title: 'Coursera Free Courses',
            image: '/images/products/coursera.jpg',
            store: 'Coursera',
            link: '/freebies/8'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreebies();
  }, []);

  return (
    <section className="bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Freebies</h2>
          <Link href="/freebies" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
            View All <FaArrowRight className="ml-1 w-3 h-3" />
          </Link>
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center items-center py-8">
            <Loader size="large" text="Loading freebies..." />
          </div>
        ) : error ? (
          <div className="w-full text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {freebies.slice(0, 8).map((freebie) => (
              <FreebieCard
                key={freebie._id}
                _id={freebie._id}
                title={freebie.title}
                image={freebie.image}
                store={freebie.store}
                link={freebie.link}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FreebiesSection;