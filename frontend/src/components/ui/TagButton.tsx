import React from 'react';

interface TagButtonProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const TagButton: React.FC<TagButtonProps> = ({
  id,
  label,
  isSelected,
  onClick,
}) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className={`py-2 px-4 rounded-full transition-all duration-200 text-sm font-medium ${
      isSelected
        ? 'bg-primary text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-primary border border-gray-300'
    }`}
  >
    {label}
  </button>
);
