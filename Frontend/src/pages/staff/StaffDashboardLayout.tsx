import React, { useState } from 'react';
import StaffSidebar from '../../components/StaffSidebar';
import Dashboard from './Dashboard';
import ManageBookings from './ManageBookings';
import ViewResources from './ViewResources';
import Reports from './Reports';
import StaffCreateBooking from './CreateBooking';
import { User } from '../../types';

interface StaffDashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const StaffDashboardLayout: React.FC<StaffDashboardLayoutProps> = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'create-booking':
        return <StaffCreateBooking />;
      case 'bookings':
        return <ManageBookings />;
      case 'resources':
        return <ViewResources />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <StaffSidebar 
        activePage={activePage} 
        onNavigate={setActivePage}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardLayout;
