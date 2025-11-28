import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  colorFrom: string;
  colorTo: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  trend,
  colorFrom,
  colorTo,
  iconColor,
}) => (
  <div className={`bg-gradient-to-br ${colorFrom} ${colorTo} rounded-lg p-6`}>
    {trend ? (
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-10 w-10 ${iconColor} mb-3`} />
        <span className="text-xs font-medium text-green-600">{trend}</span>
      </div>
    ) : (
      <Icon className={`h-10 w-10 ${iconColor} mb-3`} />
    )}
    <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);
