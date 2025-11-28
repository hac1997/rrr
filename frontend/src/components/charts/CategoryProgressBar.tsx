import React from 'react';

interface CategoryProgressBarProps {
  category: string;
  value: number;
  percentage: number;
  label?: string;
  additionalInfo?: string;
}

export const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
  category,
  value,
  percentage,
  label = 'eventos',
  additionalInfo,
}) => (
  <div className="flex items-center">
    <div className="w-32 text-sm font-medium text-gray-700">{category}</div>
    <div className="flex-1 mx-4">
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
    <div className="w-20 text-right">
      <span className="text-sm font-semibold text-gray-800">
        {value} {label}
      </span>
    </div>
    {additionalInfo && (
      <div className="w-24 text-right">
        <span className="text-sm text-gray-600">{additionalInfo}</span>
      </div>
    )}
    <div className="w-12 text-right">
      <span className="text-xs text-gray-500">{percentage}%</span>
    </div>
  </div>
);
