
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Users,
  FileText,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  Megaphone,
  Mic,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTickets } from '@/hooks/useTickets';
import { useCurrentBusinessId } from '@/hooks/useCurrentBusinessId';

interface SidebarProps {
  collapsed: boolean;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  notification?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { toast } = useToast();
  const { businessId } = useCurrentBusinessId();
  const { openTicketCount } = useTickets(businessId);

  const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'Bookings', href: '/bookings', icon: Calendar },
    { title: 'Customers', href: '/customers', icon: Users },
    { title: 'Invoicing', href: '/invoicing', icon: FileText },
    { title: 'Analytics', href: '/analytics', icon: BarChart2 },
    { title: 'Marketing', href: '/marketing', icon: Megaphone },
    { 
      title: 'Support', 
      href: '/support', 
      icon: MessageSquare, 
      notification: openTicketCount > 0 
    },
    { title: 'Voice Assistant', href: '/voice-assistant', icon: Mic },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.'
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 flex justify-center items-center border-b h-16">
        {!collapsed && <h1 className="text-xl font-semibold">AppSense</h1>}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                    collapsed && 'justify-center'
                  )
                }
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.notification && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500">
                      <span className="sr-only">Notification</span>
                    </span>
                  )}
                </div>
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={cn("p-4", collapsed ? "px-2" : "")}>
        <Button 
          variant="outline" 
          className={cn(
            "w-full flex items-center gap-2",
            collapsed && "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
