import React from 'react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userRole: string;
}

export function Sidebar({ activePage, onNavigate, onLogout, userRole }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'create-booking', label: 'Create Booking', icon: '➕' },
    { id: 'my-bookings', label: 'My Bookings', icon: '📋' },
    { id: 'view-resources', label: 'View Resources', icon: '🏢' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Student Portal</h1>
        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-600 rounded">
          {userRole}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activePage === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <span className="mr-3">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
