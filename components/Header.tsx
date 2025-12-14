import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 bg-osmak-green text-white py-3 px-4 shadow-md">
      <img 
        src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
        alt="OsMak Logo" 
        className="h-12 w-auto"
      />
      <div className="flex flex-col">
        <h1 className="m-0 text-base font-bold tracking-widest uppercase">OSPITAL NG MAKATI</h1>
        <span className="text-sm opacity-90">Employee Health & Wellness Tracker</span>
      </div>
    </header>
  );
};

export default Header;
