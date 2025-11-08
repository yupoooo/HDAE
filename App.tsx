
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { HealthWallet } from './components/HealthWallet';
import { Chat } from './components/Chat';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { useAuth } from './contexts/AuthContext';

export type View = 'dashboard' | 'wallet' | 'chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { isAuthenticated } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'wallet':
        return <HealthWallet />;
      case 'chat':
        return <Chat />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
