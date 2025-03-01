"use client"

import { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import SearchBar from '@/components/Search/SearchBar';
import FreebieCard from '@/components/FreebieCard';
import Loader from '@/components/ui/Loader';

interface Freebie {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string;
  link: string;
  image: string;
  startDate: string;
  endDate: string;
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function FreebiesPage() {
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFreebies = async (page: number) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`/api/freebies?page=${page}&limit=12`);
      if (!response.ok) throw new Error('Failed to fetch freebies');
      
      const data = await response.json();
      setFreebies(data.freebies);
      setMeta(data.pagination);
    } catch (err) {
      setError('Failed to load freebies. Please try again later.');
      console.error('Error fetching freebies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFreebies(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <SearchBar />
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="text-red-500 text-center mb-8">{error}</div>
        )}

        {isLoading ? (
          
                <div className="flex justify-center items-center ">
           <Loader size='large'  text='Loading...' />
                </div>
              
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freebies.map((freebie) => (
                <FreebieCard
                  key={freebie._id}
                  freebie={{
                    id: freebie._id,
                    title: freebie.title,
                    description: freebie.description,
                    store: freebie.store,
                    image: freebie.image || '/product-placeholder.png',
                    link: freebie.link
                  }}
                />
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {meta.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}