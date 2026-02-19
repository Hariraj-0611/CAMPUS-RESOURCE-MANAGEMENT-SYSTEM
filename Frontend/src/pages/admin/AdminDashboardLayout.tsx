import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminBookings from './AdminBookings';
import AdminResources from './AdminResources';
import ManageUsers from './ManageUsers';
import Reports from '../staff/Reports';
import { User } from '../../types';

interface AdminDashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'bookings':
        return <AdminBookings />;
      case 'resources':
        return <AdminResources />;
      case 'users':
        return <ManageUsers />;
      case 'reports':
        return <Reports />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
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

export default AdminDashboardLayout;
