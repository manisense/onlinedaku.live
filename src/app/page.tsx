import MainNav from '@/components/Navigation/MainNav';
import SearchBar from '@/components/Search/SearchBar';
import FeaturedDeals from '@/components/Home/FeaturedDeals';
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
      <FeaturedDeals />
      <Footer />
    </main>
  );
}
