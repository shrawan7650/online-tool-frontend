import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors"
              aria-label="Go to home page"
            >
              <Settings className="h-8 w-8 text-blue-500" />
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
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                aria-label="View source code on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 Online Tools Portal. Built with React & Node.js</p>
            <p className="text-sm mt-2">Professional developer utilities for everyday tasks</p>
          </div>
        </div>
      </footer>
    </div>
  );
}