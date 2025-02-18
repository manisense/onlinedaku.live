import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} OnlineDaku. All rights reserved.</p>
          </div>
          <div className="w-full md:w-auto text-center md:text-right">
            <nav className="space-x-4">
              <a href="/about" className="hover:text-gray-300">About</a>
              <a href="/contact" className="hover:text-gray-300">Contact</a>
              <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;