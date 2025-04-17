
import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Users, 
  Calendar, 
  FileText, 
  TicketCheck, 
  TrendingUp, 
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react';

const statsCards = [
  { title: 'Total Customers', value: '132', icon: Users, change: '+8%', positive: true },
  { title: 'Active Bookings', value: '24', icon: Calendar, change: '+12%', positive: true },
  { title: 'Pending Invoices', value: '8', icon: FileText, change: '-3%', positive: false },
  { title: 'Open Tickets', value: '3', icon: TicketCheck, change: '+1', positive: false },
];

const recentActivity = [
  { id: 1, action: 'New Booking', client: 'Sarah Johnson', time: '10 minutes ago', type: 'booking' },
  { id: 2, action: 'Invoice Paid', client: 'Michael Brown', time: '1 hour ago', type: 'invoice' },
  { id: 3, action: 'New Ticket', client: 'Emily Davis', time: '3 hours ago', type: 'ticket' },
  { id: 4, action: 'Booking Cancelled', client: 'Robert Wilson', time: '5 hours ago', type: 'booking' },
];

const upcomingBookings = [
  { id: 1, service: 'Haircut', client: 'James Thomas', time: '2:00 PM', date: 'Today' },
  { id: 2, service: 'Lawn Mowing', client: 'Lisa Anderson', time: '10:00 AM', date: 'Tomorrow' },
  { id: 3, service: 'Dog Walking', client: 'Chris Evans', time: '4:30 PM', date: 'Tomorrow' },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="dashboard-card card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                  <p className={`text-xs mt-1 ${card.positive ? 'text-success' : 'text-destructive'}`}>
                    {card.change} from last week
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <card.icon size={20} className="text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 dashboard-card">
            <div className="flex justify-between items-center mb-4">
              <h2>Recent Activity</h2>
              <button className="text-sm text-primary">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 border rounded-md bg-gray-50">
                  <div className="p-2 rounded-full mr-3">
                    {activity.type === 'booking' && <Calendar size={18} className="text-info" />}
                    {activity.type === 'invoice' && <FileText size={18} className="text-success" />}
                    {activity.type === 'ticket' && <TicketCheck size={18} className="text-warning" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.client}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Bookings */}
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-4">
              <h2>Upcoming Bookings</h2>
              <button className="text-sm text-primary">View Calendar</button>
            </div>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{booking.service}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {booking.date}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{booking.client}</span>
                    <span className="text-gray-600">{booking.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="dashboard-card">
            <h3 className="flex items-center mb-3">
              <TrendingUp size={18} className="mr-2 text-primary" />
              Revenue Overview
            </h3>
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md">
              <p className="text-gray-500">[Revenue Chart Placeholder]</p>
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">This Month</span>
                <span className="font-semibold">$3,240.00</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3 className="flex items-center mb-3">
              <DollarSign size={18} className="mr-2 text-primary" />
              Invoicing Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">$840.00</span>
                  <span className="status-pending">4</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Overdue</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">$320.00</span>
                  <span className="status-error">2</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Paid (Last 30 days)</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">$1,540.00</span>
                  <span className="status-success">8</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3 className="flex items-center mb-3">
              <CheckCircle size={18} className="mr-2 text-primary" />
              Support Overview
            </h3>
            <div className="space-y-3">
              <div className="p-2 rounded-md bg-gray-50 flex justify-between">
                <span className="text-sm">Open Tickets</span>
                <span className="font-medium">3</span>
              </div>
              <div className="p-2 rounded-md bg-gray-50 flex justify-between">
                <span className="text-sm">Avg. Response Time</span>
                <span className="font-medium">2h 15m</span>
              </div>
              <div className="p-2 rounded-md bg-gray-50 flex justify-between">
                <span className="text-sm">Solved This Week</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
