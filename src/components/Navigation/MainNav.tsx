"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaTelegram } from 'react-icons/fa';

const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Deals', href: '/deals' },
    { name: 'Coupons', href: '/coupons' },
    { name: 'Freebies', href: '/freebies' },
    { name: 'Stores', href: '/stores' },
    { name: 'Blogs', href: '/blog' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Image src="/logo.svg" alt="OnlineDaku Logo" width={36} height={36} priority  />
              <Link href="/" className="text-2xl ml-2 font-bold text-gray-800">
                OnlineDaku
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Telegram Button */}
          <div className="hidden sm:flex sm:items-center">
            <Link
              href="https://t.me/onlinedaku"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              <FaTelegram className="mr-1.5" />
              Join Telegram
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Telegram Link */}
          <Link
            href="https://t.me/onlinedaku"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center pl-3 pr-4 py-2 text-base font-medium text-blue-500 hover:text-blue-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <FaTelegram className="mr-2" />
            Join Telegram
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;