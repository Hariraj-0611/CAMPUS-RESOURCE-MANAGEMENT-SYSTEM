import React, { useState } from 'react';
import { Menu, X, LogOut, GraduationCap } from 'lucide-react';
import { UserRole } from '../types';
export interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}
interface SidebarProps {
  menuItems: MenuItem[];
  activeItem: string;
  onItemClick: (key: string) => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}
export function Sidebar({
  menuItems,
  activeItem,
  onItemClick,
  userRole,
  userName,
  onLogout
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1e3a5f] text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-lg">Campus CRM</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-[#162c46]">

          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1e3a5f] text-white transform transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-auto md:flex md:flex-col
      `}>

        {/* Header */}
        <div className="p-6 border-b border-[#2d4a70] flex items-center space-x-3">
          <div className="bg-white p-1.5 rounded-full">
            <GraduationCap className="h-6 w-6 text-[#1e3a5f]" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Campus</h1>
            <p className="text-xs text-gray-300">Resource Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) =>
            <li key={item.key}>
                <button
                onClick={() => {
                  onItemClick(item.key);
                  setIsOpen(false);
                }}
                className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
                    ${activeItem === item.key ? 'bg-[#2d4a70] text-white shadow-sm' : 'text-gray-300 hover:bg-[#2d4a70] hover:text-white'}
                  `}>

                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#2d4a70] bg-[#162c46]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-[#64748b] flex items-center justify-center text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {userName}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#2d4a70] text-blue-100">
                {userRole}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#2d4a70] hover:bg-[#3e5d85] text-white rounded-md text-sm transition-colors">

            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        onClick={() => setIsOpen(false)}>
      </div>
      }
    </>);

}