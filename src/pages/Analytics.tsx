
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import RevenueChart from '../components/analytics/RevenueChart';
import RetentionChart from '../components/analytics/RetentionChart';
import PredictiveChart from '../components/analytics/PredictiveChart';

const Analytics: React.FC = () => {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const handleRefreshData = () => {
    setLoading(true);
    // Simulate API call to refresh data
    setTimeout(() => {
      setLoading(false);
      setLastRefreshed(new Date());
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastRefreshed.toLocaleString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshData} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trends Section */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Revenue Trends</CardTitle>
                <div className="flex items-center text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span className="text-sm font-medium">+12.5% vs. last month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <RevenueChart />
              </div>
            </CardContent>
          </Card>

          {/* Customer Retention Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Customer Retention</CardTitle>
                <div className="flex items-center text-red-500">
                  <ArrowDownRight size={16} className="mr-1" />
                  <span className="text-sm font-medium">-2.3% vs. last month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <RetentionChart />
              </div>
            </CardContent>
          </Card>

          {/* Predictive Booking Section */}
          <Card>
            <CardHeader>
              <CardTitle>Predictive Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PredictiveChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
