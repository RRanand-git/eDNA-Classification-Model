
import React from 'react';
import { DnaIcon, HistoryIcon, HomeIcon, InfoIcon, ResultIcon } from './Icons';

type View = 'upload' | 'results' | 'history' | 'about';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  hasResults: boolean;
}

const NavLink: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, icon, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span>{label}</span>
  </button>
);


const Header: React.FC<HeaderProps> = ({ currentView, setView, hasResults }) => {
  return (
    <header className="bg-surface/80 backdrop-blur-md shadow-sm w-full sticky top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => setView('upload')}>
          <DnaIcon className="h-8 w-8" />
          <h1 className="text-xl font-bold ml-3 text-gray-800 hidden sm:block">
            eDNA Classifier
          </h1>
        </div>
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-100/80 p-1 rounded-lg">
          <NavLink
            label="Home"
            icon={<HomeIcon className="h-5 w-5" />}
            isActive={currentView === 'upload'}
            onClick={() => setView('upload')}
          />
          <NavLink
            label="Results"
            icon={<ResultIcon className="h-5 w-5" />}
            isActive={currentView === 'results'}
            onClick={() => setView('results')}
            disabled={!hasResults}
          />
          <NavLink
            label="History"
            icon={<HistoryIcon className="h-5 w-5" />}
            isActive={currentView === 'history'}
            onClick={() => setView('history')}
          />
          <NavLink
            label="About"
            icon={<InfoIcon className="h-5 w-5" />}
            isActive={currentView === 'about'}
            onClick={() => setView('about')}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;