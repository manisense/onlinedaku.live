'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FaChartBar, 
  FaTags, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBlog
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { confirmLogout } from '@/utils/confirmDialog';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaChartBar },
    { name: 'Deals', href: '/admin/deals', icon: FaTags },
    { name: 'Blogs', href: '/admin/blogs', icon: FaBlog },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        return;
      }

      try {
        const res = await fetch('/api/admin/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not authenticated and on login page, show only the login form
  if (!isAuthenticated && pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // If not authenticated and not on login page, don't show anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Show admin layout only when authenticated
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <Link href="/admin/dashboard" className="text-white text-xl font-bold">
            Admin Panel
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full mt-4 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FaSignOutAlt className="mr-4 h-6 w-6" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open sidebar</span>
            <FaBars className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
