import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import Analytics from './pages/Analytics';
import LoginScreen from './components/LoginScreen'; // Import the new LoginScreen
import { Employee } from './types';
import { EmployeeService, CacheService } from './services/api';
import { SCRIPT_URL } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for authentication status in session storage on initial load
  useEffect(() => {
    if (sessionStorage.getItem('isAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    // Hardcoded password check
    if (password === 'industrialclinic') {
      setIsAuthenticated(true);
      setLoginError(null);
      sessionStorage.setItem('isAuthenticated', 'true'); // Persist session
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };
  
  const loadData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && allEmployees.length === 0) {
      setLoading(true);
    }
    setError(null);
    try {
      if (!SCRIPT_URL) {
        throw new Error("Backend URL is not configured. Please update `constants.ts` with your deployed Apps Script URL.");
      }
      const data = await EmployeeService.getAll(forceRefresh);
      setAllEmployees(data);
      CacheService.set(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (allEmployees.length === 0) {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [allEmployees.length]);

  // Load data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const cachedData = CacheService.get();
      if (cachedData) {
        setAllEmployees(cachedData);
        setLoading(false);
        loadData(false);
      } else {
        loadData(false);
      }
    }
  }, [isAuthenticated, loadData]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  const renderView = () => {
    const activeEmployees = allEmployees.filter(e => e.status === 'Active');
    const showInitialLoader = loading && allEmployees.length === 0;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard employees={activeEmployees} loading={showInitialLoader} error={error} onRefresh={() => loadData(true)} />;
      case 'register':
        return (
          <div className="p-8">
            <RegistrationForm 
              onSuccess={() => {
                loadData(true).then(() => {
                  setCurrentView('dashboard');
                });
              }} 
            />
          </div>
        );
      case 'analytics':
        return <Analytics employees={activeEmployees} loading={showInitialLoader} />;
      default:
        return <Dashboard employees={activeEmployees} loading={showInitialLoader} error={error} onRefresh={() => loadData(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-main">
      <Header onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;