import React from 'react';
import MainNav from '../Navigation/MainNav';
import Footer from '../Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="sticky top-0 z-50 w-full">
        <MainNav />
      </div>
      <main className="flex-grow w-full mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;