
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

// Mock data for predictive booking
const predictiveData = [
  { name: 'Monday', value: 12 },
  { name: 'Tuesday', value: 15 },
  { name: 'Wednesday', value: 18 },
  { name: 'Thursday', value: 14 },
  { name: 'Friday', value: 22 },
  { name: 'Saturday', value: 25 },
  { name: 'Sunday', value: 8 }
];

const COLORS = ['#2563EB', '#10B981', '#FBBF24', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316'];

const PredictiveChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={predictiveData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {predictiveData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} bookings`, 'Predicted']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PredictiveChart;
