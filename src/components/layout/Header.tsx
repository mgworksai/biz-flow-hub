
import React from 'react';
import { Bell, Menu, X, Search, Settings, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="bg-white border-b h-[var(--header-height)] flex items-center px-4 md:px-6">
      <button
        onClick={toggleSidebar}
        className="mr-4 text-gray-500 hover:text-primary focus:outline-none"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>
      
      <div className="flex-1 flex items-center">
        <div className="relative max-w-md w-full hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="form-input pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-primary relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        
        <button className="text-gray-500 hover:text-primary" aria-label="Settings">
          <Settings size={20} />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;
