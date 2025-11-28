import React from 'react';

interface DynamicListInputProps {
  items: string[];
  onUpdate: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder: string;
  addButtonLabel: string;
}

export const DynamicListInput: React.FC<DynamicListInputProps> = ({
  items,
  onUpdate,
  onAdd,
  onRemove,
  placeholder,
  addButtonLabel,
}) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <div key={index} className="flex items-center space-x-2">
        <input
          type="text"
          value={item}
          onChange={(e) => onUpdate(index, e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder={placeholder}
        />
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Remover
          </button>
        )}
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="text-green-600 hover:text-green-700 font-medium text-sm"
    >
      + {addButtonLabel}
    </button>
  </div>
);
