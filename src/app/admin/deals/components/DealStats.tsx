'use client';

import { FaChartLine, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

interface DealStatsProps {
  totalDeals: number;
  activeDeals: number;
  expiredDeals: number;
  upcomingDeals: number;
}

export default function DealStats({ totalDeals, activeDeals, expiredDeals, upcomingDeals }: DealStatsProps) {
  const stats = [
    {
      name: 'Total Deals',
      value: totalDeals,
      icon: FaChartLine,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Deals',
      value: activeDeals,
      icon: FaCheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'Expired Deals',
      value: expiredDeals,
      icon: FaTimesCircle,
      color: 'bg-red-500',
    },
    {
      name: 'Upcoming Deals',
      value: upcomingDeals,
      icon: FaClock,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 