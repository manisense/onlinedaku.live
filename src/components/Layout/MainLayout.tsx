import React from 'react';
import MainNav from '../Navigation/MainNav';
import Footer from '../Footer';
import TelegramBanner from '../TelegramBanner';


interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <TelegramBanner />
      <div className="sticky top-0 z-50 w-full">
        <MainNav />
      </div>
      <main className="flex-grow bg-white w-full mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;