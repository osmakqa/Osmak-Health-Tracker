import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import Analytics from './pages/Analytics';
import { Employee } from './types';
import { EmployeeService, CacheService } from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize the loadData function, preventing re-renders.
  const loadData = useCallback(async (forceRefresh = false) => {
    // Only show a full-page loader on the very first load when there's no cache.
    if (!forceRefresh && allEmployees.length === 0) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await EmployeeService.getAll(forceRefresh);
      setAllEmployees(data);
      CacheService.set(data); // Update the cache with fresh data.
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      // Only show an error screen if we failed to load any data at all.
      if (allEmployees.length === 0) {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [allEmployees.length]); // Dependency ensures this function is stable unless the array presence changes.

  // This effect runs once on initial mount to load data.
  useEffect(() => {
    const cachedData = CacheService.get();
    if (cachedData) {
      setAllEmployees(cachedData);
      setLoading(false); // Instantly show cached data.
      loadData(false); // Then, fetch fresh data in the background.
    } else {
      loadData(false); // No cache, so fetch data with a loading screen.
    }
  }, [loadData]); // The dependency array is correct now with useCallback.

  const renderView = () => {
    // Filter for active employees once, and pass the result to the components.
    const activeEmployees = allEmployees.filter(e => e.status === 'Active');

    // Only show the main loading/error component if there's no data to display.
    const showInitialLoader = loading && allEmployees.length === 0;

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            employees={activeEmployees} 
            loading={showInitialLoader}
            error={error} 
            onRefresh={() => loadData(true)} 
          />
        );
      case 'register':
        return (
          <div className="p-8">
            <RegistrationForm 
              onSuccess={() => {
                // After successful registration, force a refresh and switch to the dashboard.
                loadData(true).then(() => {
                  setCurrentView('dashboard');
                });
              }} 
            />
          </div>
        );
      case 'analytics':
        return (
          <Analytics 
            employees={activeEmployees} 
            loading={showInitialLoader}
          />
        );
      default:
        return (
          <Dashboard 
            employees={activeEmployees} 
            loading={showInitialLoader}
            error={error} 
            onRefresh={() => loadData(true)} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-main">
      <Header />
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
