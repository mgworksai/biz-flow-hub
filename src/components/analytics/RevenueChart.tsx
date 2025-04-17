
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

// Mock data for revenue trends
const revenueData = [
  { date: '1 Apr', revenue: 1200 },
  { date: '8 Apr', revenue: 1900 },
  { date: '15 Apr', revenue: 1600 },
  { date: '22 Apr', revenue: 2200 },
  { date: '29 Apr', revenue: 2500 },
  { date: '6 May', revenue: 2300 },
  { date: '13 May', revenue: 2800 },
  { date: '20 May', revenue: 3100 },
  { date: '27 May', revenue: 3600 },
  { date: '3 Jun', revenue: 3300 },
  { date: '10 Jun', revenue: 3800 },
  { date: '17 Jun', revenue: 4100 }
];

const RevenueChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={revenueData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis 
          dataKey="date" 
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis 
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Revenue']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#2563EB" 
          strokeWidth={2} 
          activeDot={{ r: 8 }} 
          name="Revenue (USD)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
