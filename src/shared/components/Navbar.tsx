import React from 'react';
import { Search, User, Settings, Menu, Bell } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, sidebarCollapsed = false }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Toggle Button for Mobile */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} className="text-gray-300" />
        </button>
        
        {/* User Welcome Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
            <User size={20} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h2 className="font-semibold text-white">Welcome Rusiru De Silva</h2>
            <p className="text-sm text-gray-400">System Administrator</p>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search events, users..."
            className="bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-lg w-64 lg:w-80 
                     border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                     focus:outline-none transition-all duration-200"
          />
        </div>
        
        {/* Mobile Search Button */}
        <button className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors md:hidden">
          <Search size={16} className="text-gray-300" />
        </button>
        
        {/* Notifications */}
        <div className="relative">
          <button className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors relative">
            <Bell size={16} className="text-gray-300" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              5
            </span>
          </button>
        </div>
        
        {/* Profile */}
        <button className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <User size={16} className="text-gray-300" />
        </button>
        
        {/* Settings */}
        <button className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Settings size={16} className="text-gray-300" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;