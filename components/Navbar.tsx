import React from 'react';
import { ViewState, User } from '../types';
import { GraduationCap, LogOut } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, currentView, onNavigate, onLogout }) => {
  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer text-white" onClick={() => user ? onNavigate('dashboard') : onNavigate('login')}>
            <GraduationCap className="h-8 w-8 text-white" />
            <span className="ml-3 text-xl font-bold tracking-tight">ClassKeep</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-indigo-100 text-sm">Welcome, {user.username}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'login' ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'signup' ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};