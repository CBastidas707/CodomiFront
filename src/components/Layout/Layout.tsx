
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return (
      <div className="min-h-screen bg-codomi-gray flex flex-col w-full overflow-x-hidden">
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-codomi-gray flex flex-col w-full overflow-x-hidden">
      <Header />
      <div className="flex flex-1 w-full min-w-0 relative pt-16">
        {isMobile ? <MobileSidebar /> : <Sidebar />}
        <main className={`flex-1 min-w-0 overflow-x-hidden ${!isMobile ? 'ml-64' : ''}`}>
          <div className="p-6 md:p-8 space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
