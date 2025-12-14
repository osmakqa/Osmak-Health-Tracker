import React from 'react';
import { LayoutDashboard, UserPlus, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'register', label: 'Register Employee', icon: <UserPlus size={20} /> },
    { id: 'analytics', label: 'Data Analysis', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="w-20 md:w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] flex flex-col transition-all duration-300">
      <nav className="flex-1 py-6 px-2 md:px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-osmak-green text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className={`${currentView === item.id ? 'text-white' : 'text-osmak-green'}`}>
              {item.icon}
            </div>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100 hidden md:block">
        <div className="text-xs text-gray-400">
          v1.0.0 Osmak Health
        </div>
      </div>
    </div>
  );
};

export default Sidebar;