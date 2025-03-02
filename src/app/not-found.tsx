import Link from 'next/link';
import { MdError } from "react-icons/md";
import Footer from '@/components/Footer';
import TelegramBanner from '@/components/TelegramBanner';
import MainNav from '@/components/Navigation/MainNav';
import SearchBar from '@/components/Search/SearchBar';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <TelegramBanner />
      <div className="sticky top-0 z-50 w-full">
        <MainNav />
      </div>
      <SearchBar />
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center flex-col items-center justify-center w-full h-full">

          <div className="text-center items-center justify-center w-full h-full">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl mb-4">
            Page not found
          </h1>
          </div>
          <div className="text-center items-center justify-center w-full h-full">
          <div className="flex justify-center items-center mb-4">
            <MdError size={60} color='gray' />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Sorry, we could not find the page you are looking for. It might have been moved, deleted, or never existed.
          </p>
          </div>
          <div className="text-center items-center justify-center w-full h-full">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Home
          </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}