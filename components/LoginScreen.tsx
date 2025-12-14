import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (password: string) => void;
  error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-osmak-green text-white p-6 flex items-center gap-4">
          <img 
            src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
            alt="OsMak Logo" 
            className="h-14 w-auto bg-white rounded-full p-1"
          />
          <div className="flex flex-col">
            <h1 className="m-0 text-xl font-bold tracking-wider uppercase">OSPITAL NG MAKATI</h1>
            <span className="text-sm opacity-90">Employee Health & Wellness Tracker</span>
          </div>
        </div>
        
        {/* Form Area */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-osmak-green focus:border-osmak-green"
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-600 bg-red-50 p-2 rounded-md">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white transition-colors duration-200 transform bg-osmak-green rounded-md hover:bg-osmak-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-osmak-green"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;