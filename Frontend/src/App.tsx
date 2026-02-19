import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { CreateBooking as StudentCreateBooking } from './pages/student/CreateBooking';
import { MyBookings as StudentMyBookings } from './pages/student/MyBookings';
import { ViewResources as StudentViewResources } from './pages/student/ViewResources';
import StaffDashboardLayout from './pages/staff/StaffDashboardLayout';
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import { ToastProvider } from './components/Toast';
import { authAPI } from './services/api';
import { User } from './types';

type Page = 
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'student-dashboard'
  | 'student-create-booking'
  | 'student-my-bookings'
  | 'student-view-resources'
  | 'staff-dashboard'
  | 'admin-dashboard';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Always start at login page - user must explicitly login
    // Clear any old session data on app load
    authAPI.logout();
    setCurrentPage('login');
    setUser(null);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (userData.role === 'ADMIN') {
      setCurrentPage('admin-dashboard');
    } else if (userData.role === 'STAFF') {
      setCurrentPage('staff-dashboard');
    } else {
      setCurrentPage('student-dashboard');
    }
  };

  const handleLogout = () => {
    console.log('App.tsx handleLogout called');
    authAPI.logout();
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} onNavigateToForgotPassword={() => setCurrentPage('forgot-password')} />;
      
      case 'register':
        return <RegisterPage onNavigateToLogin={() => setCurrentPage('login')} />;
      
      case 'forgot-password':
        return <ForgotPasswordPage onNavigateToLogin={() => setCurrentPage('login')} />;
      
      case 'student-dashboard':
        return (
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage('student-view-resources')}
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      View Resources
                    </button>
                    <button
                      onClick={() => setCurrentPage('student-create-booking')}
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Create Booking
                    </button>
                    <button
                      onClick={() => setCurrentPage('student-my-bookings')}
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name || user?.email}</h2>
                  <p className="text-gray-600">Select an option from the menu above to get started.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => setCurrentPage('student-view-resources')}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">View Resources</h3>
                    <p className="text-sm text-gray-600">Browse available resources and their details</p>
                  </button>

                  <button
                    onClick={() => setCurrentPage('student-create-booking')}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Booking</h3>
                    <p className="text-sm text-gray-600">Book a resource for your needs</p>
                  </button>

                  <button
                    onClick={() => setCurrentPage('student-my-bookings')}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
                    <p className="text-sm text-gray-600">View and manage your bookings</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'student-create-booking':
        return (
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentPage('student-dashboard')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <StudentCreateBooking
                user={user!}
                onSuccess={() => setCurrentPage('student-my-bookings')}
                onCancel={() => setCurrentPage('student-dashboard')}
              />
            </div>
          </div>
        );
      
      case 'student-my-bookings':
        return (
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentPage('student-dashboard')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <StudentMyBookings />
            </div>
          </div>
        );
      
      case 'student-view-resources':
        return (
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentPage('student-dashboard')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <StudentViewResources />
            </div>
          </div>
        );
      
      case 'staff-dashboard':
        return <StaffDashboardLayout user={user!} onLogout={handleLogout} />;
      
      case 'admin-dashboard':
        return <AdminDashboardLayout user={user!} onLogout={handleLogout} />;
      
      default:
        return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} onNavigateToForgotPassword={() => setCurrentPage('forgot-password')} />;
    }
  };

  return (
    <ToastProvider>
      {renderPage()}
    </ToastProvider>
  );
}
