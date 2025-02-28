'use client';

import { useState, useEffect } from 'react';
import { FaUsers, FaUserCheck, FaUserPlus, FaUserClock } from 'react-icons/fa';
import StatsCard from '../../dashboard/components/StatsCard';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  newUsers: number;
  recentlyActiveUsers: number;
  monthlyGrowth: number;
}

export default function UserStatsSection() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/users/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch user stats');
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-4">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-red-500">Could not load user statistics</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<FaUsers className="text-blue-500" />}
        change={stats.monthlyGrowth}
        changeLabel="vs last month"
      />
      <StatsCard
        title="Active Users"
        value={stats.activeUsers}
        icon={<FaUserCheck className="text-green-500" />}
        change={Math.round((stats.activeUsers / stats.totalUsers) * 100) - 70} // Just for demonstration
        changeLabel="vs overall"
      />
      <StatsCard
        title="New Users"
        value={stats.newUsers}
        icon={<FaUserPlus className="text-purple-500" />}
        change={stats.monthlyGrowth}
        changeLabel="last 30 days"
      />
      <StatsCard
        title="Recent Logins"
        value={stats.recentlyActiveUsers}
        icon={<FaUserClock className="text-orange-500" />}
        change={Math.round((stats.recentlyActiveUsers / stats.activeUsers) * 100) - 50} // Just for demonstration
        changeLabel="last 7 days"
      />
    </div>
  );
}
