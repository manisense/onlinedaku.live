'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  FaTachometerAlt, FaTag, FaUsers, FaCog, FaChartBar, 
  FaBars, FaTimes, FaSignOutAlt
} from 'react-icons/fa';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname ? (pathname === path || pathname.startsWith(`${path}/`)) : false;
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <FaTachometerAlt className="mr-3 h-4 w-4" />,
    },
    {
      name: 'Deals & Coupons',
      href: '/admin/deals',
      icon: <FaTag className="mr-3 h-4 w-4" />,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <FaUsers className="mr-3 h-4 w-4" />,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <FaChartBar className="mr-3 h-4 w-4" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <FaCog className="mr-3 h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="font-semibold text-lg text-indigo-600">Admin Panel</div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={`bg-white h-screen fixed top-0 left-0 w-64 border-r border-gray-200 transition-all duration-300 ease-in-out transform z-30
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="font-bold text-xl text-indigo-600">Online Daku</div>
          <div className="text-sm text-gray-500">Admin Panel</div>
        </div>
        
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 mt-6 pt-4 px-4">
            <button
              onClick={onLogout}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 w-full rounded-md"
            >
              <FaSignOutAlt className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay to close mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
