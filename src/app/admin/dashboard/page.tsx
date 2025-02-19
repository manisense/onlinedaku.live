'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token and get admin data
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Authentication failed');
        }

        const data = await res.json();
        setAdmin(data.admin);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // const StatCard = ({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) => (
  //   <div className="bg-white overflow-hidden shadow rounded-lg">
  //     <div className="p-5">
  //       <div className="flex items-center">
  //         <div className="flex-shrink-0">
  //           <Icon className="h-6 w-6 text-gray-400" />
  //         </div>
  //         <div className="ml-5 w-0 flex-1">
  //           <dl>
  //             <dt className="text-sm font-medium text-gray-500 truncate">
  //               {title}
  //             </dt>
  //             <dd className="text-lg font-medium text-gray-900">
  //               {value.toLocaleString()}
  //             </dd>
  //           </dl>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{admin?.email}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  router.push('/admin/login');
                }}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Welcome, {admin?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {admin?.permissions.map((permission) => (
                <div
                  key={permission}
                  className="bg-white overflow-hidden shadow rounded-lg p-4"
                >
                  <div className="text-sm font-medium text-gray-500">
                    {permission.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 