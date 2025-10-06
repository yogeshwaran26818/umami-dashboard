'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const timeRanges = [
  'Today', 'Last 24 hours', 'This week', 'Last 7 days', 'This month',
  'Last 30 days', 'Last 90 days', 'This year', 'Last 6 months', 
  'Last 12 months', 'All time', 'Custom range'
];

export default function ViewsChart({ data, visitors }) {
  const [selectedRange, setSelectedRange] = useState('Last 30 days');
  const [showDropdown, setShowDropdown] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Views vs Visitors</h3>
          <TimeRangeSelector 
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        </div>
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    time: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: item.views,
    visitors: visitors?.[index]?.visitors || Math.floor(item.views * 0.7) // Mock visitors data
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-medium text-white">Views vs Visitors</h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <TimeRangeSelector 
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#1F2937' }}
              name="Views"
            />
            <Line 
              type="monotone" 
              dataKey="visitors" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#1F2937' }}
              name="Visitors"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Views</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Visitors</span>
        </div>
      </div>
    </div>
  );
}

function TimeRangeSelector({ selectedRange, setSelectedRange, showDropdown, setShowDropdown }) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        <span className="text-sm">{selectedRange}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-10">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => {
                setSelectedRange(range);
                setShowDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selectedRange === range ? 'bg-gray-600 text-blue-400' : 'text-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}