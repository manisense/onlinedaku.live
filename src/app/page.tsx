import MainNav from '@/components/Navigation/MainNav';
import SearchBar from '@/components/Search/SearchBar';
import HeroSection from '@/components/Home/HeroSection';
import FeaturedDeals from '@/components/Home/FeaturedDeals';
import Newsletter from '@/components/Home/Newsletter';
import Categories from '@/components/Home/Categories';
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <div className="sticky top-0 z-50 w-full">
        <MainNav />
      </div>
      <div className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>
      <Categories />
      <HeroSection />
      <FeaturedDeals />
      <Newsletter />
      <Footer />
    </main>
  );
}
