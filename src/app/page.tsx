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
          <SearchBar />

      <Categories />
      <HeroSection />
      <FeaturedDeals />
      <Newsletter />
      <Footer />
    </main>
  );
}
