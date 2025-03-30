'use client';

import { Link as LucideLink, User, LogOut, LogIn, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = !!session?.user;
  const loading = status === 'loading';

  const handleSignOut = async () => {
    setMenuOpen(false); // Close drawer before signing out
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="drawer drawer-end z-50">
      {/* Invisible drawer toggle checkbox */}
      <input 
        id="drawer-menu" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={menuOpen}
        onChange={() => setMenuOpen(!menuOpen)}
      />
      
      {/* Page content */}
      <div className="drawer-content">
        <header className="p-4 flex items-center justify-between bg-background">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <LucideLink className="h-5 w-5" />
              <span className="font-semibold text-lg">StayLinker</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            
            {/* Drawer toggle button */}
            <label 
              htmlFor="drawer-menu"
              className="drawer-button flex items-center justify-center p-2 rounded-full hover:bg-base-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="User menu"
              tabIndex={0}
              role="button"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
              ) : isAuthenticated ? (
                session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User profile'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </label>
          </div>
        </header>
      </div>
      
      {/* Drawer sidebar */}
      <div className="drawer-side">
        {/* Overlay that closes the drawer when clicked */}
        <label htmlFor="drawer-menu" aria-label="Close menu" className="drawer-overlay"></label>
        
        {/* Drawer content - full screen */}
        <div className="bg-base-100 w-full min-h-full flex flex-col shadow-xl">
          {/* Menu header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-base-200">
            <h2 className="text-lg font-medium">Menu</h2>
            <label 
              htmlFor="drawer-menu"
              className="btn btn-sm btn-ghost btn-circle"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </label>
          </div>
          
          {/* Drawer body content */}
          <div className="overflow-y-auto flex-1">
            {isAuthenticated ? (
              <>
                {/* User profile section */}
                <div className="p-6 border-b border-base-200">
                  <div className="flex items-center gap-4">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User profile'}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-sm text-base-content/60 truncate">{session.user.email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Menu items */}
                <ul className="menu p-4 w-full">
                  <li>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3"
                      aria-label="Sign out"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <ul className="menu p-4 w-full">
                <li>
                  <Link 
                    href="/auth/signin"
                    className="flex items-center gap-3"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign in</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
