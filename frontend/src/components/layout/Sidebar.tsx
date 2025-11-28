import React from 'react';
import { LogOut, LucideIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  userName: string;
  userRole: string;
  userInitial: string;
  badgeLabel: string;
  badgeValue: string | number;
  menuItems: MenuItem[];
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  gradientFrom: string;
  gradientTo: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userName,
  userRole,
  userInitial,
  badgeLabel,
  badgeValue,
  menuItems,
  currentView,
  onViewChange,
  onLogout,
  gradientFrom,
  gradientTo,
}) => (
  <aside className="w-64 min-h-screen bg-zinc-50 shadow-lg border-r border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center text-white font-bold text-xl`}
        >
          {userInitial}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{userName}</h3>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-secondary rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 ">{badgeLabel}</span>
          <span className="font-bold text-blue-500">{badgeValue}</span>
        </div>
      </div>
    </div>

    <nav className="p-4 bg-white shadow-md">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
              currentView === item.id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>

    <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Sair</span>
      </button>
    </div>
  </aside>
);
