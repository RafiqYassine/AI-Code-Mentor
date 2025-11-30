import React from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  currentPage: 'analyze' | 'history';
  onNavigate: (page: 'analyze' | 'history') => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogin, 
  onLogout,
  currentPage,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-[#fafafa]/80 backdrop-blur-md border-b border-neutral-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('analyze')}>
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-semibold text-neutral-900 tracking-tight">AI Code Mentor</span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            {user && (
               <div className="flex bg-neutral-100 p-1 rounded-lg mr-2">
                 <button 
                    onClick={() => onNavigate('analyze')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentPage === 'analyze' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                 >
                   Analyze
                 </button>
                 <button 
                    onClick={() => onNavigate('history')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentPage === 'history' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
                 >
                   History
                 </button>
               </div>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-neutral-200">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-neutral-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <Button variant="ghost" onClick={onLogout} className="text-xs sm:text-sm">Sign Out</Button>
              </div>
            ) : (
              <Button variant="primary" onClick={onLogin}>Sign In</Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-neutral-200 py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} AI Code Mentor. Powered by Gemini 2.0 Flash.</p>
        </div>
      </footer>
    </div>
  );
};
