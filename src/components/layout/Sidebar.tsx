
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  TicketCheck, 
  BarChart3, 
  Megaphone, 
  Settings, 
  LogOut,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Bookings', icon: Calendar, path: '/bookings' },
  { name: 'Customers', icon: Users, path: '/customers' },
  { name: 'Invoices', icon: FileText, path: '/invoices' },
  { name: 'Support', icon: TicketCheck, path: '/support' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Marketing', icon: Megaphone, path: '/marketing' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside 
      className={`bg-white border-r transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'
      }`}
    >
      <div className="h-[var(--header-height)] flex items-center px-4 border-b">
        {!collapsed ? (
          <h1 className="text-xl font-bold text-primary">BizFlowHub</h1>
        ) : (
          <span className="text-xl font-bold text-primary">B</span>
        )}
      </div>
      
      <div className="p-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center w-full py-2 px-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${collapsed ? 'justify-center' : 'justify-start'}`}
              >
                <item.icon size={20} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-4 w-full px-4">
        <button className="flex items-center w-full py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
          <LogOut size={20} className={collapsed ? 'mx-auto' : 'mr-3'} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
