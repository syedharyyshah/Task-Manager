import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Sample data to ensure Medium and High are included
const defaultData = [
  { priority: 'Low', count: 1 },
  { priority: 'Medium', count: 3 },
  { priority: 'High', count: 2 },
];

const CustomBarChart = ({ data = defaultData }) => {
  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-white dark:bg-gray-900 mt-6">
        <span className="text-gray-500 dark:text-gray-50">No priority data available</span>
      </div>
    );
  }

  const getBarColor = (entry) => {
    switch (entry?.priority) {
      case 'Low':
        return '#00BC70';
      case 'Medium':
        return '#FE9900';
      case 'High':
        return '#FF1F57';
      default:
        return '#00BC70';
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 border border-gray-300 dark:border-gray-700">
          <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 mb-1">
            {payload[0].payload.priority}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-50">
            Count:{' '}
            <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom YAxis tick component to apply Tailwind classes
  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          fontSize={12}
          className="fill-gray-500 dark:fill-gray-50"
          textAnchor="end"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Custom XAxis tick component to apply Tailwind classes
  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          fontSize={12}
          className="fill-gray-500 dark:fill-gray-50"
          textAnchor="middle"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="priority"
            tick={<CustomXAxisTick />}
            stroke="none"
          />
          <YAxis
            tick={<CustomYAxisTick />}
            stroke="none"
            ticks={[0, 1, 2, 3, 4]} // Explicitly set Y-axis ticks to 0-4
            domain={[0, 4]} // Set domain to ensure 0-4 range
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'transparent' }}
          />
          <Bar dataKey="count" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;