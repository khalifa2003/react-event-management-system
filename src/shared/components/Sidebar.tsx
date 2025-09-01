// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Ticket, 
  TrendingUp, 
  Settings,
  ChevronDown,
  Plus,
  BarChart3,
  Users,
  MessageSquare,
  LogOut,
  Bell,
  User,
  Star,
  Tag,
  X
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  collapsed?: boolean;
  badge?: number;
}

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
  defaultExpanded?: boolean;
}

const NavSection: React.FC<NavSectionProps> = ({ title, children, collapsed, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (collapsed) {
    return <div className="space-y-1 px-2">{children}</div>;
  }

  return (
    <div className="px-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-xs text-gray-400 uppercase tracking-wider font-medium mb-3 hover:text-gray-300 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown 
          size={12} 
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>
      {expanded && (
        <div className="space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path, collapsed = false, badge }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
  };

  return (
    <button 
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
        isActive 
          ? 'bg-gray-800 text-white shadow-md border border-gray-700' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
      title={collapsed ? label : undefined}
    >
      <Icon size={18} className={`${isActive ? 'text-green-400' : 'group-hover:text-green-400'} transition-colors`} />
      {!collapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
          {badge && badge > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium min-w-[20px] text-center">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
      {collapsed && badge && badge > 0 && (
        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token'); // Example
    navigate('/login');
  };

  return (
    <>
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={`
        ${collapsed ? 'w-16' : 'w-64'} 
        bg-black border-r border-gray-800 transition-all duration-300 flex flex-col 
        fixed lg:relative h-full z-50 lg:z-auto shadow-xl lg:shadow-none
      `}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-black font-bold shadow-lg">
                E
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">EventX</h1>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">STUDIO</p>
                </div>
              )}
            </div>
            
            {!collapsed && (
              <button 
                onClick={onToggle}
                className="p-1 hover:bg-gray-800 rounded lg:hidden"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Add Event Button */}
        <div className="p-4 border-b border-gray-800">
          <button 
            onClick={() => navigate('/dashboard/events/new')} 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={16} />
            {!collapsed && 'Add Quick Event'}
          </button>
          {!collapsed && (
            <p className="text-xs text-gray-400 mt-2 text-center">Create new events instantly</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Navigation */}
            <NavSection title="Main Navigation" collapsed={collapsed} defaultExpanded>
              <NavItem icon={BarChart3} label="Dashboard" path="/dashboard" collapsed={collapsed} />
              <NavItem icon={Calendar} label="Manage Events" path="/dashboard/events" collapsed={collapsed} badge={5} />
              <NavItem icon={Ticket} label="Booking & Tickets" path="/dashboard/bookings" collapsed={collapsed} />
              <NavItem icon={Users} label="Attendee Insights" path="/dashboard/attendees" collapsed={collapsed} />
              <NavItem icon={TrendingUp} label="Analytics & Reports" path="/dashboard/analytics" collapsed={collapsed} />
            </NavSection>
            
            {/* Support & Management */}
            <NavSection title="Support & Management" collapsed={collapsed}>
              <NavItem icon={MessageSquare} label="Contact Support" path="/dashboard/support" collapsed={collapsed} />
              <NavItem icon={Bell} label="Notifications" path="/dashboard/notifications" collapsed={collapsed} badge={12} />
              <NavItem icon={Settings} label="Settings" path="/dashboard/settings" collapsed={collapsed} />
            </NavSection>
            
            {/* Additional Features */}
            <NavSection title="Additional Features" collapsed={collapsed}>
              <NavItem icon={Star} label="Marketing" path="/dashboard/marketing" collapsed={collapsed} />
              <NavItem icon={Tag} label="Event Categories" path="/dashboard/categories" collapsed={collapsed} />
            </NavSection>
            
            {/* Account Management */}
            <NavSection title="Account Management" collapsed={collapsed}>
              <NavItem icon={User} label="Manage Users" path="/dashboard/users" collapsed={collapsed} />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                {!collapsed && <span className="text-sm font-medium flex-1 text-left">Logout</span>}
              </button>
            </NavSection>
          </div>
        </nav>

        {/* User Profile Card */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Rusiru De Silva</p>
                  <p className="text-xs text-gray-400 truncate">System Admin</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;