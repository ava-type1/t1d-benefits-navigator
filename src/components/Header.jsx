import React from 'react';

const Header = () => {
  return (
    <header className="bg-bg-secondary border-b border-bg-tertiary">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">🩺</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                T1D Benefits Navigator
              </h1>
              <p className="text-text-secondary text-sm">
                Find Patient Assistance Programs for Type 1 Diabetes
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm text-text-secondary">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-accent-green rounded-full"></span>
              <span>30+ Programs</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
              <span>Updated 2025</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-accent-yellow rounded-full"></span>
              <span>100% Free</span>
            </span>
          </div>
        </div>
        
        {/* Progress indicator could go here */}
      </div>
    </header>
  );
};

export default Header;