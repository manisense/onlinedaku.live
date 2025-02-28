import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  change: number;
  changeLabel: string;
}

export default function StatsCard({ title, value, icon, change, changeLabel }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
        <span className={`ml-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {change >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{changeLabel}</p>
    </div>
  );
}
