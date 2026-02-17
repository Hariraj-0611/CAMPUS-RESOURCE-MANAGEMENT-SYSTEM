import React, { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, CheckSquare, History, Calendar, PlusCircle } from 'lucide-react';
import { ToastProvider } from './components/Toast';
import { Sidebar, MenuItem } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageResources } from './pages/admin/ManageResources';
import { BookingApprovals } from './pages/admin/BookingApprovals';
import { BookingHistory } from './pages/admin/BookingHistory';
import { ViewResources } from './pages/student/ViewResources';
import { CreateBooking } from './pages/student/CreateBooking';
import { MyBookings } from './pages/student/MyBookings';
import { AuthState, Page, User } from './types';
export function App() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null
  });
  const [currentPage, setCurrentPage] = useState<Page>('LOGIN');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const handleLogin = (user: User, token: string) => {
    setAuth({
      user,
      token
    });
    // Redirect based on role
    if (user.role === 'ADMIN') {
      setCurrentPage('MANAGE_USERS');
    } else {
      setCurrentPage('VIEW_RESOURCES');
    }
  };
  const handleLogout = () => {
    setAuth({
      user: null,
      token: null
    });
    setCurrentPage('LOGIN');
  };
  const handleBookNow = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setCurrentPage('CREATE_BOOKING');
  };
  // Define menu items based on role
  const getMenuItems = (): MenuItem[] => {
    if (!auth.user) return [];
    if (auth.user.role === 'ADMIN') {
      return [{
        key: 'MANAGE_USERS',
        label: 'Manage Users',
        icon: <Users className="h-5 w-5" />
      }, {
        key: 'MANAGE_RESOURCES',
        label: 'Manage Resources',
        icon: <LayoutDashboard className="h-5 w-5" />
      }, {
        key: 'BOOKING_APPROVALS',
        label: 'Approvals',
        icon: <CheckSquare className="h-5 w-5" />
      }, {
        key: 'BOOKING_HISTORY',
        label: 'History',
        icon: <History className="h-5 w-5" />
      }];
    }
    // Student & Staff
    return [{
      key: 'VIEW_RESOURCES',
      label: 'View Resources',
      icon: <LayoutDashboard className="h-5 w-5" />
    }, {
      key: 'CREATE_BOOKING',
      label: 'Book Resource',
      icon: <PlusCircle className="h-5 w-5" />
    }, {
      key: 'MY_BOOKINGS',
      label: 'My Bookings',
      icon: <Calendar className="h-5 w-5" />
    }];
  };
  const renderContent = () => {
    switch (currentPage) {
      case 'MANAGE_USERS':
        return <ManageUsers />;
      case 'MANAGE_RESOURCES':
        return <ManageResources />;
      case 'BOOKING_APPROVALS':
        return <BookingApprovals />;
      case 'BOOKING_HISTORY':
        return <BookingHistory />;
      case 'VIEW_RESOURCES':
        return <ViewResources onBookNow={handleBookNow} />;
      case 'CREATE_BOOKING':
        return <CreateBooking user={auth.user!} preSelectedResourceId={selectedResourceId} onSuccess={() => setCurrentPage('MY_BOOKINGS')} onCancel={() => setCurrentPage('VIEW_RESOURCES')} />;
      case 'MY_BOOKINGS':
        return <MyBookings user={auth.user!} />;
      default:
        return <div>Page not found</div>;
    }
  };
  return <ToastProvider>
      <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900">
        {!auth.user ? <LoginPage onLogin={handleLogin} /> : <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar menuItems={getMenuItems()} activeItem={currentPage} onItemClick={(key) => setCurrentPage(key as Page)} userRole={auth.user.role} userName={auth.user.name} onLogout={handleLogout} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
              <div className="max-w-7xl mx-auto">{renderContent()}</div>
            </main>
          </div>}
      </div>
    </ToastProvider>;
}