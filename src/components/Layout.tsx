import React,{ ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Github, LogIn } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { UserMenu } from './UserMenu';
import { LoginModal } from './auth/LoginModal';
import { useState } from 'react';


interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-white transition-colors hover:text-blue-400"
              aria-label="Go to home page"
            >
              <Settings className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">Online Tools</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'text-blue-400 bg-blue-500/10' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              {/* {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center px-3 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )} */}
              
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 transition-colors rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                aria-label="View source code on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-slate-800 bg-slate-950/50">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 Online Tools Portal. Built with React & Node.js</p>
            <p className="mt-2 text-sm">Professional developer utilities for everyday tasks</p>
          </div>
        </div>
      </footer>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}