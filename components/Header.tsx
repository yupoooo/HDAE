
import React from 'react';
import type { View } from '../App';
import { HealthIcon, LogOutIcon, UserIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  const navItemClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap";
  const activeClasses = "bg-teal-600 text-white";
  const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <HealthIcon className="h-8 w-8 text-teal-500" />
            <span className="mr-3 text-xl font-bold text-gray-800 dark:text-white hidden sm:inline">DAHC</span>
          </div>
          
          <nav className="flex-1 sm:flex-none flex justify-center items-center">
            <div className="flex space-x-1 sm:space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                <button
                onClick={() => setCurrentView('dashboard')}
                className={`${navItemClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
                >
                الخطة
                </button>
                <button
                onClick={() => setCurrentView('wallet')}
                className={`${navItemClasses} ${currentView === 'wallet' ? activeClasses : inactiveClasses}`}
                >
                المحفظة
                </button>
                 <button
                onClick={() => setCurrentView('chat')}
                className={`${navItemClasses} ${currentView === 'chat' ? activeClasses : inactiveClasses}`}
                >
                الدردشة
                </button>
            </div>
          </nav>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                <UserIcon className="w-5 h-5 text-teal-500" />
                <span className="text-sm font-semibold">{user?.name}</span>
            </div>
             <button
              onClick={logout}
              title="تسجيل الخروج"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOutIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
