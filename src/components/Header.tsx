'use client';

import { Link as LucideLink, User, LogOut, LogIn, Menu, X, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NotificationBadge from './ui/NotificationBadge';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [inviteCount, setInviteCount] = useState(0);
  const isAuthenticated = !!session?.user;
  const loading = status === 'loading';

  // Fetch pending invitations when the user is authenticated
  useEffect(() => {
    const fetchInvitations = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch('/api/invitations');
          if (response.ok) {
            const invitations = await response.json();
            setInviteCount(invitations.length);
          }
        } catch (error) {
          console.error('Error fetching invitations:', error);
        }
      }
    };

    fetchInvitations();
    // Poll for new invitations every 60 seconds
    const intervalId = setInterval(fetchInvitations, 60000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

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
                <div className="relative">
                  {inviteCount > 0 && (
                    <NotificationBadge count={inviteCount} position="top-right" size="sm" />
                  )}
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User profile'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
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
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User profile'}
                        width={48}
                        height={48}
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
                    <Link
                      href="/invitations"
                      className="flex items-center gap-3 relative"
                      aria-label="View invitations"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Bell className="h-5 w-5" />
                      <span>Invites</span>
                      {inviteCount > 0 && (
                        <div className="flex items-center justify-center h-5 w-5 bg-error text-error-content text-xs font-medium rounded-full ml-2">
                          {inviteCount}
                        </div>
                      )}
                    </Link>
                  </li>
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
                  <Link href="/auth/signin" className="flex items-center gap-3">
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
