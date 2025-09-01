// src/components/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../shared/components/Sidebar';
import Navbar from '../../../shared/components/Navbar';

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar 
        collapsed={window.innerWidth >= 1024 ? sidebarCollapsed : !mobileMenuOpen}
        onToggle={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />
        
        {/* Page Content - This is where nested routes will render */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;