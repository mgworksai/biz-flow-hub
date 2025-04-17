
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Calendar, Plus, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// Mock data for upcoming bookings
const upcomingBookings = [
  { id: 1, client: 'Sarah Johnson', service: 'Haircut', date: '2025-04-18', time: '10:00 AM', status: 'confirmed' },
  { id: 2, client: 'Michael Brown', service: 'Beard Trim', date: '2025-04-18', time: '11:30 AM', status: 'confirmed' },
  { id: 3, client: 'Emily Davis', service: 'Lawn Mowing', date: '2025-04-19', time: '09:00 AM', status: 'pending' },
  { id: 4, client: 'Robert Wilson', service: 'Dog Walking', date: '2025-04-20', time: '03:00 PM', status: 'confirmed' },
  { id: 5, client: 'Jennifer Lee', service: 'House Cleaning', date: '2025-04-21', time: '01:00 PM', status: 'pending' },
];

const timeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Mock data for weekly calendar
const calendarEvents = [
  { id: 1, client: 'Sarah Johnson', service: 'Haircut', day: 'Monday', time: '10:00 AM', duration: 30 },
  { id: 2, client: 'Michael Brown', service: 'Beard Trim', day: 'Monday', time: '11:30 AM', duration: 30 },
  { id: 3, client: 'Emily Davis', service: 'Lawn Mowing', day: 'Wednesday', time: '09:00 AM', duration: 60 },
  { id: 4, client: 'Robert Wilson', service: 'Dog Walking', day: 'Thursday', time: '03:00 PM', duration: 60 },
  { id: 5, client: 'Jennifer Lee', service: 'House Cleaning', day: 'Friday', time: '01:00 PM', duration: 120 },
];

const Bookings = () => {
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [currentWeek, setCurrentWeek] = useState('April 17 - 23, 2025');

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1>Bookings</h1>
          <div className="flex space-x-3 mt-2 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
              <Plus size={16} className="mr-2" />
              New Booking
            </button>
            <div className="flex border rounded-md overflow-hidden">
              <button 
                className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600'}`}
                onClick={() => setView('list')}
              >
                List
              </button>
              <button 
                className={`px-3 py-2 text-sm ${view === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600'}`}
                onClick={() => setView('calendar')}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>
        
        {view === 'list' ? (
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center">
                <Calendar size={20} className="mr-2 text-primary" />
                Upcoming Bookings
              </h2>
              <button className="flex items-center text-sm text-gray-600">
                <Filter size={16} className="mr-1" />
                Filter
              </button>
            </div>
            
            <div className="table-container">
              <table className="table-base">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Client</th>
                    <th className="table-head">Service</th>
                    <th className="table-head">Date</th>
                    <th className="table-head">Time</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {upcomingBookings.map((booking) => (
                    <tr key={booking.id} className="table-row">
                      <td className="table-cell font-medium">{booking.client}</td>
                      <td className="table-cell">{booking.service}</td>
                      <td className="table-cell">{booking.date}</td>
                      <td className="table-cell">{booking.time}</td>
                      <td className="table-cell">
                        <span className={booking.status === 'confirmed' ? 'status-success' : 'status-pending'}>
                          {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button className="text-gray-500 hover:text-primary">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-4">
              <h2>Weekly Calendar</h2>
              <div className="flex items-center space-x-3">
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium">{currentWeek}</span>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[800px]">
                {/* Calendar header */}
                <div className="grid grid-cols-8 border-b">
                  <div className="py-3 px-2 text-sm font-medium text-gray-500">Time</div>
                  {days.map((day) => (
                    <div key={day} className="py-3 px-2 text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar body */}
                <div className="relative">
                  {timeSlots.map((time, timeIndex) => (
                    <div key={time} className="grid grid-cols-8 border-b">
                      <div className="py-3 px-2 text-xs text-gray-500">{time}</div>
                      {days.map((day) => {
                        const event = calendarEvents.find(e => e.day === day && e.time === time);
                        return (
                          <div key={`${day}-${time}`} className="py-3 px-2 relative">
                            {event ? (
                              <div className="absolute top-1 left-1 right-1 bg-primary/20 border-l-4 border-primary rounded-md p-2 shadow-sm text-xs">
                                <p className="font-medium">{event.client}</p>
                                <p className="text-gray-600">{event.service}</p>
                              </div>
                            ) : (
                              <div className="h-10 border border-dashed border-gray-200 rounded-md"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bookings;
