'use client';

import MainNav from '@/components/Navigation/MainNav';
import SearchBar from '@/components/Search/SearchBar';
import FeaturedDeals from '@/components/Home/FeaturedDeals';
import Categories from '@/components/Home/Categories';
import Footer from "@/components/Footer";


import DealCarousel from '@/components/Home/DealCarousel';

export default function Home() {
  return (
    <main>
      <div className="sticky top-0 z-50 w-full">
        <MainNav />
      </div>
      <SearchBar />
      <Categories />
      <div className="min-h-screen bg-white">
        <DealCarousel />
      </div>
      <FeaturedDeals />
      <Footer />
    </main>
  );
}
