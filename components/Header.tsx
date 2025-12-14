import React from 'react';
import { LogOut, Sheet } from 'lucide-react';
import { GOOGLE_SHEET_URL } from '../constants';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {

  const handleSheetLinkClick = () => {
    const password = prompt("Please enter the password to access the sheet:");
    if (password === 'maxterrenal') {
      window.open(GOOGLE_SHEET_URL, '_blank');
    } else if (password !== null) { // User didn't click cancel
      alert("Incorrect password.");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-osmak-green text-white py-3 px-4 shadow-md">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <img 
          src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
          alt="OsMak Logo" 
          className="h-12 w-auto"
        />
        <div className="flex flex-col">
          <h1 className="m-0 text-base font-bold tracking-widest uppercase">OSPITAL NG MAKATI</h1>
          <span className="text-sm opacity-90">Employee Health & Wellness Tracker</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSheetLinkClick}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          title="Access Google Sheet"
        >
          <Sheet size={20} />
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md transition-colors"
          title="Sign Out"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;