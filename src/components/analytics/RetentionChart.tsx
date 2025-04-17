
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data for customer retention
const retentionData = [
  { month: 'Jan', retention: 78 },
  { month: 'Feb', retention: 82 },
  { month: 'Mar', retention: 85 },
  { month: 'Apr', retention: 87 },
  { month: 'May', retention: 84 },
  { month: 'Jun', retention: 82 }
];

const RetentionChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={retentionData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis 
          dataKey="month" 
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis 
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Retention Rate']}
        />
        <Legend />
        <Bar 
          dataKey="retention" 
          fill="#10B981" 
          radius={[4, 4, 0, 0]} 
          name="Retention Rate (%)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RetentionChart;
