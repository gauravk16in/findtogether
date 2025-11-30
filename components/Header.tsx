import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { NAV_LINKS } from '../constants';
import { Page } from '../App';
import UserIcon from './icons/UserIcon';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onLoginClick }) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="mx-auto px-6 lg:px-12 py-6 flex justify-between items-center">
        <button 
          onClick={() => onNavigate('home')} 
          className="bg-gray-100/80 backdrop-blur-sm text-black font-bold text-lg px-4 py-2 rounded-full tracking-tight border border-black/10"
        >
          FINDTOGETHER
        </button>
        
        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <button 
              key={link.key} 
              onClick={() => onNavigate(link.key)} 
              className="text-gray-600 hover:text-black transition-colors text-sm font-medium"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="hidden lg:flex items-center gap-2 border border-black/40 rounded-full px-5 py-2 text-sm font-medium text-gray-800 hover:bg-black/5 hover:text-black transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              {user.email}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-500 border-b">
                  <div>Signed in as</div>
                  <div className="font-medium text-black">{user.email}</div>
                  <div className="text-xs capitalize">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                      onNavigate('volunteer');
                      setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Volunteer Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="hidden lg:flex items-center gap-2 border border-black/40 rounded-full px-5 py-2 text-sm font-medium text-gray-800 hover:bg-black/5 hover:text-black transition-colors"
          >
            <UserIcon className="w-4 h-4" />
            Login
          </button>
        )}
        
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden text-black bg-gray-100/80 backdrop-blur-sm p-3 rounded-full border border-black/10"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg z-40">
          <div className="px-6 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <button 
                key={link.key} 
                onClick={() => {
                  onNavigate(link.key);
                  setShowMobileMenu(false);
                }} 
                className="block w-full text-left text-gray-600 hover:text-black transition-colors text-base font-medium py-2"
              >
                {link.name}
              </button>
            ))}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    <div>Signed in as</div>
                    <div className="font-medium text-black">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('volunteer');
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left text-gray-600 hover:text-black transition-colors text-base font-medium py-2"
                  >
                    Volunteer Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left text-gray-600 hover:text-black transition-colors text-base font-medium py-2"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onLoginClick();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-base font-medium py-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;