import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTopMovers } from '../../modules/dashboard/hooks/useMarketData';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Get gainer data for header
  const { data: moversData } = useTopMovers();

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={handleToggleSidebar}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={handleToggleMobileSidebar}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header 
            onToggleMobileSidebar={handleToggleMobileSidebar} 
            data={moversData}
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-2 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;
