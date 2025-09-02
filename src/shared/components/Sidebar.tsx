// Sidebar.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Ticket, TrendingUp, Settings, ChevronDown, Plus, BarChart3, Users, MessageSquare, LogOut, Bell, User, Star, Tag, X } from 'lucide-react';
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
  if (collapsed) return <div className="space-y-1 px-2">{children}</div>;
  return (
    <div className="px-4">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-xs text-gray-400 uppercase tracking-wider font-medium mb-3 hover:text-gray-300 transition-colors">
        <span>{title}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (<div className="space-y-1">{children}</div>)}
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
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${ isActive  ? 'bg-gray-800 text-white shadow-md border border-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
      title={collapsed ? label : undefined}>
      <Icon size={18} className={`${isActive ? 'text-green-400' : 'group-hover:text-green-400'} transition-colors`} />
      {!collapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
          {badge && badge > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium min-w-[20px] text-center">{badge > 99 ? '99+' : badge}</span>
          )}
        </>
      )}
      {collapsed && badge && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
};
const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle}/>
      )}
        <div className={`${collapsed ? 'hidden' : 'w-64'}  bg-[#000] border-r border-gray-800 transition-all duration-300  flex flex-col fixed lg:relative h-full z-50 lg:z-auto shadow-xl lg:shadow-none`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center text-black font-bold shadow-lg overflow-hidden">
                <img
                  src="/src/assets/logo.svg"
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">EventX</h1>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">STUDIO</p>
                </div>
              )}
            </div>
            
            {!collapsed && (
              <button onClick={onToggle} className="p-1 hover:bg-gray-800 rounded lg:hidden"> <X size={16} className="text-gray-400" /> </button>
            )}
          </div>
        </div>
        <div className="p-2 pb-6 border-b border-white mx-2">
          <button
            onClick={() => navigate('/dashboard/events/new')}
            className="w-full flex items-center gap-3 bg-[#1E1E1E] hover:bg-gray-800 transition-all duration-200 rounded-xl shadow-lg p-3"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-[#C1FF72] rounded-xl text-white">
              <Plus size={30} />
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start">
                <span className="font-medium text-white">Add Quick Event</span>
                <span className="text-xs text-gray-400">Events</span>
              </div>
            )}
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto ">
          <div className="pb-6 border-b border-white mx-2">
            <NavSection title="Main Navigation" collapsed={collapsed} defaultExpanded>
              <NavItem icon={BarChart3} label="Dashboard" path="/dashboard" collapsed={collapsed} />
              <NavItem icon={Calendar} label="Manage Events" path="/events" collapsed={collapsed} />
              <NavItem icon={Users} label="Attendee Insights" path="/attendees" collapsed={collapsed} />
              <NavItem icon={Users} label="Categories" path="/categories" collapsed={collapsed} />
              <NavItem icon={Ticket} label="Booking & Tickets" path="/bookings" collapsed={collapsed} />
              <NavItem icon={TrendingUp} label="Analytics & Reports" path="/analytics" collapsed={collapsed} />
            </NavSection>
          </div>
          <div className="pt-4 pb-2 border-b border-white mx-2">
            <NavSection title="Support & Management" collapsed={collapsed}>
              <NavItem icon={MessageSquare} label="Contact Support" path="/support" collapsed={collapsed} />
              <NavItem icon={Bell} label="Notifications" path="/notifications" collapsed={collapsed} badge={12} />
              <NavItem icon={Settings} label="Settings" path="/settings" collapsed={collapsed} />
            </NavSection>
          </div>
          <div className="pt-4 pb-2 border-b border-white mx-2">
            <NavSection title="Additional Features" collapsed={collapsed}>
              <NavItem icon={Star} label="Marketing" path="/marketing" collapsed={collapsed} />
              <NavItem icon={Tag} label="Event Categories" path="/categories" collapsed={collapsed} />
            </NavSection>
          </div>
          <div className="pt-4 pb-2 border-b border-white mx-2">
            <NavSection title="Account Management" collapsed={collapsed}>
              <NavItem icon={User} label="Manage Users" path="/users" collapsed={collapsed} />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-gray-400 hover:text-white hover:bg-gray-800/50">
                <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                {!collapsed && <span className="text-sm font-medium flex-1 text-left">Logout</span>}
              </button>
            </NavSection>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;