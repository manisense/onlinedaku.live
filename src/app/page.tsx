'use client';

import MainNav from '@/components/Navigation/MainNav';
import SearchBar from '@/components/Search/SearchBar';
import Footer from "@/components/Footer";
import CouponsSection from '@/components/Home/CouponsSection';
import FreebiesSection from '@/components/Home/FreebiesSection';
import StoresSection from '@/components/Home/StoresSection';
import DealsSection from '@/components/Home/DealsSection';
import TelegramBanner from '@/components/TelegramBanner';
import BannerCarousel from '@/components/Home/BannerCarousel';

export default function Home() {
  return (
    <main>
      <TelegramBanner />
      <div className="sticky top-0 z-50 w-full">
        <MainNav />
      </div>
      <SearchBar />
      <BannerCarousel />
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
