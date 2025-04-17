
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, Search, Filter, Phone, Mail, MapPin, Edit, Trash, UserPlus } from 'lucide-react';

// Mock data for customers
const customers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '(555) 123-4567', location: 'New York, NY', status: 'active', lastBooking: '2 days ago' },
  { id: 2, name: 'Michael Brown', email: 'michael.b@example.com', phone: '(555) 234-5678', location: 'Los Angeles, CA', status: 'active', lastBooking: '1 week ago' },
  { id: 3, name: 'Emily Davis', email: 'emily.d@example.com', phone: '(555) 345-6789', location: 'Chicago, IL', status: 'inactive', lastBooking: '3 weeks ago' },
  { id: 4, name: 'Robert Wilson', email: 'robert.w@example.com', phone: '(555) 456-7890', location: 'Houston, TX', status: 'active', lastBooking: '5 days ago' },
  { id: 5, name: 'Jennifer Lee', email: 'jennifer.l@example.com', phone: '(555) 567-8901', location: 'Phoenix, AZ', status: 'active', lastBooking: 'Yesterday' },
  { id: 6, name: 'David Miller', email: 'david.m@example.com', phone: '(555) 678-9012', location: 'Philadelphia, PA', status: 'inactive', lastBooking: '2 months ago' },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const customer = customers.find(c => c.id === selectedCustomer);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1>Customers</h1>
          <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium mt-2 sm:mt-0">
            <UserPlus size={16} className="mr-2" />
            Add Customer
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-2 dashboard-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h2>Customer Directory</h2>
              <div className="flex w-full sm:w-auto space-x-2">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="form-input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center text-sm text-gray-600 border rounded-md px-3 py-2">
                  <Filter size={16} className="mr-1" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="table-base">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Name</th>
                    <th className="table-head">Email</th>
                    <th className="table-head">Phone</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Last Booking</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className={`table-row cursor-pointer ${selectedCustomer === customer.id ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedCustomer(customer.id)}
                    >
                      <td className="table-cell font-medium">{customer.name}</td>
                      <td className="table-cell">{customer.email}</td>
                      <td className="table-cell">{customer.phone}</td>
                      <td className="table-cell">
                        <span className={customer.status === 'active' ? 'status-success' : 'status-pending'}>
                          {customer.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-cell text-gray-500">{customer.lastBooking}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Customer Details */}
          <div className="dashboard-card">
            {selectedCustomer ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2>Customer Details</h2>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <Edit size={18} className="text-gray-500" />
                    </button>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <Trash size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <span className="text-2xl font-bold">{customer?.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{customer?.name}</h3>
                  <span className={`text-xs mt-1 ${customer?.status === 'active' ? 'status-success' : 'status-pending'}`}>
                    {customer?.status === 'active' ? 'Active Customer' : 'Inactive Customer'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail size={18} className="mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{customer?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={18} className="mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{customer?.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin size={18} className="mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p>{customer?.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-md bg-gray-50">
                      <p className="text-sm font-medium">Booking Completed</p>
                      <p className="text-xs text-gray-500">Haircut - April 15, 2025</p>
                    </div>
                    <div className="p-3 rounded-md bg-gray-50">
                      <p className="text-sm font-medium">Invoice #1084 Paid</p>
                      <p className="text-xs text-gray-500">$45.00 - April 15, 2025</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Plus size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Customer Selected</h3>
                <p className="text-gray-500 text-sm">Select a customer from the list to view their details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
