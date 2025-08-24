
import React from 'react';
import type { User } from '../types';
import { ShieldCheckIcon } from './icons';

interface HeaderProps {
    user: User | null;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onSignupClick, onLogoutClick }) => {
  return (
    <header className="bg-brand-secondary shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-brand-accent" />
            <h1 className="text-2xl font-bold tracking-wider text-white">
                IPA Guardian
            </h1>
        </div>
        <div>
            {user ? (
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-brand-text-secondary hidden md:block">Welcome, {user.email}</span>
                    <button 
                        onClick={onLogoutClick}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={onLoginClick}
                        className="bg-brand-secondary hover:bg-gray-800 border border-brand-accent text-brand-accent text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Login
                    </button>
                     <button 
                        onClick={onSignupClick}
                        className="bg-brand-accent hover:bg-sky-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Sign Up
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
