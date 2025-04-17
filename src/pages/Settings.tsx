import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Save, User, Users, Bell, Shield, Building, CreditCard, Mail, Phone } from 'lucide-react';

interface SettingsTabProps {
  children: React.ReactNode;
  active: boolean;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ children, active }) => {
  return (
    <div className={`py-3 px-4 text-sm font-medium cursor-pointer ${
      active ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'
    }`}>
      {children}
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('business');
  
  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="mb-6">Settings</h1>
        
        <div className="dashboard-card overflow-hidden">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b">
            <SettingsTab active={activeTab === 'business'} onClick={() => setActiveTab('business')}>
              <div className="flex items-center">
                <Building size={16} className="mr-2" />
                Business Profile
              </div>
            </SettingsTab>
            <SettingsTab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                User Roles
              </div>
            </SettingsTab>
            <SettingsTab active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}>
              <div className="flex items-center">
                <CreditCard size={16} className="mr-2" />
                Billing
              </div>
            </SettingsTab>
            <SettingsTab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
              <div className="flex items-center">
                <Bell size={16} className="mr-2" />
                Notifications
              </div>
            </SettingsTab>
            <SettingsTab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
              <div className="flex items-center">
                <Shield size={16} className="mr-2" />
                Security
              </div>
            </SettingsTab>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'business' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Business Profile</h2>
                
                <div className="max-w-2xl">
                  <div className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                        <Building size={32} />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Business Logo</h3>
                        <p className="text-sm text-gray-500 mb-2">This will be displayed on your customer portal and invoices</p>
                        <button className="px-3 py-1 border rounded-md text-sm">Upload Image</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="form-label">Business Name</label>
                      <input type="text" className="form-input" defaultValue="Biz Flow Hub" />
                    </div>
                    
                    <div>
                      <label className="form-label">Business Type</label>
                      <select className="form-input">
                        <option>Hair Salon</option>
                        <option>Landscaping</option>
                        <option>Dog Walking</option>
                        <option>House Cleaning</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Phone Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input type="tel" className="form-input pl-10" defaultValue="(555) 123-4567" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="form-label">Email Address</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input type="email" className="form-input pl-10" defaultValue="contact@bizflowhub.com" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label">Business Address</label>
                      <textarea className="form-input" rows={3} defaultValue="123 Business St, Suite 101, New York, NY 10001"></textarea>
                    </div>
                    
                    <div>
                      <label className="form-label">Business Hours</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">Monday - Friday</label>
                          <input type="text" className="form-input" defaultValue="8:00 AM - 6:00 PM" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Saturday - Sunday</label>
                          <input type="text" className="form-input" defaultValue="10:00 AM - 4:00 PM" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'users' && (
              <>
                <h2 className="text-xl font-semibold mb-6">User Roles & Permissions</h2>
                
                <div className="mb-6">
                  <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                    <User size={16} className="mr-2" />
                    Add Team Member
                  </button>
                </div>
                
                <div className="table-container">
                  <table className="table-base">
                    <thead className="table-header">
                      <tr>
                        <th className="table-head">User</th>
                        <th className="table-head">Email</th>
                        <th className="table-head">Role</th>
                        <th className="table-head">Status</th>
                        <th className="table-head">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      <tr className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                              <span className="text-xs font-bold">JD</span>
                            </div>
                            <span className="font-medium">John Doe</span>
                          </div>
                        </td>
                        <td className="table-cell">john.doe@example.com</td>
                        <td className="table-cell">
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            Owner
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="status-success">Active</span>
                        </td>
                        <td className="table-cell">
                          <button className="text-sm text-primary">Edit</button>
                        </td>
                      </tr>
                      <tr className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-primary-foreground mr-2">
                              <span className="text-xs font-bold">JS</span>
                            </div>
                            <span className="font-medium">Jane Smith</span>
                          </div>
                        </td>
                        <td className="table-cell">jane.smith@example.com</td>
                        <td className="table-cell">
                          <span className="bg-success/20 text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
                            Staff
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="status-success">Active</span>
                        </td>
                        <td className="table-cell">
                          <button className="text-sm text-primary">Edit</button>
                        </td>
                      </tr>
                      <tr className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center text-primary-foreground mr-2">
                              <span className="text-xs font-bold">RJ</span>
                            </div>
                            <span className="font-medium">Robert Johnson</span>
                          </div>
                        </td>
                        <td className="table-cell">robert.j@example.com</td>
                        <td className="table-cell">
                          <span className="bg-info/20 text-info-foreground px-2 py-1 rounded-full text-xs font-medium">
                            Read Only
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="status-pending">Invited</span>
                        </td>
                        <td className="table-cell">
                          <button className="text-sm text-primary">Resend</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Owner</h4>
                      <p className="text-sm text-gray-600 mb-2">Full access to all features and settings</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Manage team members and roles</li>
                        <li>• Access billing and subscription settings</li>
                        <li>• View and edit all bookings, invoices, and customer data</li>
                        <li>• Configure business settings</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Staff</h4>
                      <p className="text-sm text-gray-600 mb-2">Manage day-to-day operations</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• View and edit bookings</li>
                        <li>• Create and edit customer profiles</li>
                        <li>• Create and edit invoices</li>
                        <li>• View and respond to support tickets</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Read Only</h4>
                      <p className="text-sm text-gray-600 mb-2">View-only access to most features</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• View bookings</li>
                        <li>• View customer profiles</li>
                        <li>• View invoices</li>
                        <li>• View support tickets</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'notifications' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
                
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">New Bookings</p>
                          <p className="text-sm text-gray-500">Receive an email when a new booking is made</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Invoice Payments</p>
                          <p className="text-sm text-gray-500">Receive an email when an invoice is paid</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Support Tickets</p>
                          <p className="text-sm text-gray-500">Receive an email when a new support ticket is created</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">New Bookings</p>
                          <p className="text-sm text-gray-500">Receive an SMS when a new booking is made</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Urgent Support Tickets</p>
                          <p className="text-sm text-gray-500">Receive an SMS for high priority support tickets</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Frequency</h3>
                    <div className="p-4 border rounded-md">
                      <div className="mb-4">
                        <label className="form-label">Daily Digest</label>
                        <select className="form-input">
                          <option>Disabled</option>
                          <option selected>8:00 AM</option>
                          <option>12:00 PM</option>
                          <option>6:00 PM</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Receive a daily summary of all activity</p>
                      </div>
                      
                      <div>
                        <label className="form-label">Weekly Summary</label>
                        <select className="form-input">
                          <option>Disabled</option>
                          <option>Monday</option>
                          <option selected>Friday</option>
                          <option>Sunday</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Receive a weekly summary of all activity</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {/* Other tabs would go here... */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
