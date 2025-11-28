import React from 'react';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => (
  <>
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => onPeriodChange('month')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedPeriod === 'month'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-200'
        }`}
      >
        Este Mês
      </button>
      <button
        onClick={() => onPeriodChange('year')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedPeriod === 'year'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-200'
        }`}
      >
        Este Ano
      </button>
      <button
        onClick={() => onPeriodChange('custom')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedPeriod === 'custom'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-200'
        }`}
      >
        Período Personalizado
      </button>
    </div>

    {selectedPeriod === 'custom' && (
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Inicial
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Final
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    )}
  </>
);
