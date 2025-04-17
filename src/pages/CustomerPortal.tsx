
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PortalBooking from '../components/portal/PortalBooking';
import PortalInvoices from '../components/portal/PortalInvoices';
import PortalSupport from '../components/portal/PortalSupport';
import PortalAccount from '../components/portal/PortalAccount';

const CustomerPortal: React.FC = () => {
  const location = useLocation();
  const [theme, setTheme] = useState({
    headerColor: '#2563EB',
    logoUrl: '/placeholder.svg'
  });

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/portal' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header style={{ backgroundColor: theme.headerColor }} className="text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src={theme.logoUrl} 
              alt="Business Logo" 
              className="h-10 w-10 bg-white rounded-full p-1"
            />
            <span className="font-semibold text-lg">Customer Portal</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/portal" className={`hover:text-white/80 ${isActive('/portal') ? 'font-semibold' : ''}`}>
              Home
            </Link>
            <Link to="/portal/booking" className={`hover:text-white/80 ${isActive('/portal/booking') ? 'font-semibold' : ''}`}>
              Book
            </Link>
            <Link to="/portal/support" className={`hover:text-white/80 ${isActive('/portal/support') ? 'font-semibold' : ''}`}>
              Support
            </Link>
          </nav>
          
          <div className="md:hidden">
            <Button variant="ghost" className="text-white" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 border-r bg-white">
          <nav className="p-4 space-y-1">
            <Link to="/portal" className={`block p-2 rounded-md ${isActive('/portal') && location.pathname === '/portal' ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}`}>
              Home
            </Link>
            <Link to="/portal/booking" className={`block p-2 rounded-md ${isActive('/portal/booking') ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}`}>
              Booking
            </Link>
            <Link to="/portal/invoices" className={`block p-2 rounded-md ${isActive('/portal/invoices') ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}`}>
              Invoices
            </Link>
            <Link to="/portal/support" className={`block p-2 rounded-md ${isActive('/portal/support') ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}`}>
              Support
            </Link>
            <Link to="/portal/account" className={`block p-2 rounded-md ${isActive('/portal/account') ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}`}>
              Account
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<PortalHome />} />
            <Route path="/booking" element={<PortalBooking />} />
            <Route path="/invoices" element={<PortalInvoices />} />
            <Route path="/support" element={<PortalSupport />} />
            <Route path="/account" element={<PortalAccount theme={theme} setTheme={setTheme} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const PortalHome: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome to Your Customer Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary text-primary-foreground p-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <Button asChild className="w-full">
              <Link to="/portal/booking">Book an Appointment</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/portal/invoices">View Invoices</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/portal/support">Contact Support</Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary text-primary-foreground p-4">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
          </div>
          <div className="p-4">
            <div className="border rounded-md p-3 mb-2">
              <div className="font-medium">Haircut</div>
              <div className="text-sm text-gray-500">April 20, 2025 - 2:30 PM</div>
            </div>
            <div className="text-sm text-right">
              <Link to="/portal/booking" className="text-primary hover:underline">View All</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
