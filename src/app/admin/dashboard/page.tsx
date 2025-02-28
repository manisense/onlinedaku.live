'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShoppingBag, FaUsers, FaChartLine } from 'react-icons/fa';
import StatsCard from './components/StatsCard';
import RecentDeals from './components/RecentDeals';
import ActivityChart from './components/ActivityChart';
import AlertsSection from './components/AlertsSection';

interface DashboardStats {
  totalDeals: number;
  activeDeals: number;
  totalUsers: number;
  totalViews: number;
  monthlyGrowth: number;
  recentDeals: Array<{
    _id: string;
    title: string;
    store: string;
    createdAt: string;
    status: 'active' | 'inactive';
  }>;
  alerts: Array<{
    _id: string;
    message: string;
    type: 'warning' | 'info' | 'error';
    createdAt: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchDashboardStats();
    }
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Deals"
            value={stats?.totalDeals || 0}
            icon={<FaShoppingBag className="text-blue-500" />}
            change={15}
            changeLabel="vs last month"
          />
          <StatsCard
            title="Active Deals"
            value={stats?.activeDeals || 0}
            icon={<FaChartLine className="text-green-500" />}
            change={8}
            changeLabel="vs last month"
          />
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<FaUsers className="text-purple-500" />}
            change={-5}
            changeLabel="vs last month"
          />
          <StatsCard
            title="Total Views"
            value={stats?.totalViews || 0}
            icon={<FaChartLine className="text-orange-500" />}
            change={25}
            changeLabel="vs last month"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h2>
            <ActivityChart />
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
            <AlertsSection alerts={stats?.alerts || []} />
          </div>

          {/* Recent Deals */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 p-6 pb-0">Recent Deals</h2>
            <RecentDeals deals={stats?.recentDeals || []} />
          </div>
        </div>
      </div>
  );
}