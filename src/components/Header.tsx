'use client';

import { Link as LucideLink, User, LogOut, LogIn, Menu } from 'lucide-react';
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
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="p-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <LucideLink className="h-5 w-5" />
          <span className="font-semibold text-lg">StayLinker</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="User menu"
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
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-semibold">{session.user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  <a
                    href="#"
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </a>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
