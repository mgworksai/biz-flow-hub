
import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RevenueChart from '../components/analytics/RevenueChart';
import RetentionChart from '../components/analytics/RetentionChart';
import PredictiveChart from '../components/analytics/PredictiveChart';

const Analytics: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RevenueChart />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <RetentionChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Predictive Booking</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <PredictiveChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
