import React from 'react';

interface ChartData {
  month: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  colorFrom: string;
  colorTo: string;
  hoverColorFrom: string;
  hoverColorTo: string;
  tooltipFormatter?: (data: ChartData) => string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  colorFrom,
  colorTo,
  hoverColorFrom,
  hoverColorTo,
  tooltipFormatter,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-end justify-between h-64 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end h-48 mb-2">
              <div
                className={`w-full bg-gradient-to-t ${colorFrom} ${colorTo} rounded-t transition-all duration-300 hover:${hoverColorFrom} hover:${hoverColorTo} relative group`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tooltipFormatter ? tooltipFormatter(item) : item.value}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 font-medium">{item.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
