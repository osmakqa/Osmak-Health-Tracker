import React from 'react';

const Header: React.FC = () => {
  const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1oYt8XCQrexcCqfeF-j4JHr2WLlTMu0s1_Rf2SSHN1xE/edit?gid=822590190#gid=822590190';
  const ADMIN_PASSWORD = 'osmak123';

  const handleLogoClick = () => {
    const password = prompt("Enter admin password:");
    
    if (password === ADMIN_PASSWORD) {
      window.open(GOOGLE_SHEET_URL, '_blank');
    } else if (password !== null && password !== "") { // User entered something, but it was incorrect.
      alert('Incorrect password.');
    }
    // If the user clicks "Cancel" (password is null) or enters nothing, do nothing.
  };

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 bg-osmak-green text-white py-3 px-4 shadow-md">
      <img 
        src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
        alt="OsMak Logo" 
        className="h-12 w-auto cursor-pointer"
        onClick={handleLogoClick}
        title="Admin Access" // This is hidden but good for accessibility
      />
      <div className="flex flex-col">
        <h1 className="m-0 text-base font-bold tracking-widest uppercase">OSPITAL NG MAKATI</h1>
        <span className="text-sm opacity-90">Employee Health & Wellness Tracker</span>
      </div>
    </header>
  );
};

export default Header;
