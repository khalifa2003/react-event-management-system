import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu} from 'lucide-react';
import Sidebar from '../../../shared/components/Sidebar';

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false); 
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen">
      <div className={`${isMobile ? (mobileMenuOpen ? 'block' : 'hidden') : 'block'}`}>
        <Sidebar collapsed={isMobile ? false : sidebarCollapsed} onToggle={closeMobileMenu}/>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
      <button onClick={toggleSidebar}  className="fixed top-4 right-0 bg-gray-800 text-white p-1.5 transition-all duration-300 group shadow-lg">
        <Menu size={20} className="text-white" />
        <span className="absolute right-full top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 bg-gray-800 text-white px-3 py-1 rounded-l-lg whitespace-nowrap transition-all duration-300">Open Sidebar</span>
      </button>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container-fluid mx-auto px-4 py-6 bg-black">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;