import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            <a href="/">OnlineDaku</a>
          </div>
          <nav className="space-x-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/deals" className="text-gray-600 hover:text-gray-900">Deals</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;