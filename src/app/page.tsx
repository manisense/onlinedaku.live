'use client';

import MainNav from '@/components/Navigation/MainNav';
import SearchBar from '@/components/Search/SearchBar';
import Categories from '@/components/Home/Categories';
import Footer from "@/components/Footer";


import DealCarousel from '@/components/Home/DealCarousel';
import CouponsSection from '@/components/Home/CouponsSection';
import FreebiesSection from '@/components/Home/FreebiesSection';
import StoresSection from '@/components/Home/StoresSection';
import DealsSection from '@/components/Home/DealsSection';
import TelegramBanner from '@/components/TelegramBanner';

export default function Home() {
  return (
    <main>
      <TelegramBanner />
      <div className="sticky top-0 z-50 w-full">
        <MainNav />
      </div>
      <SearchBar />
      <Categories />
      <DealCarousel />
      <div className='sections bg-white my-5 py-5'>
      <DealsSection/>
      <CouponsSection />
      <FreebiesSection />
      <StoresSection />
      </div>
      <Footer />
    </main>
  );
}
