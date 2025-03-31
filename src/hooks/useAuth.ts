'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseAuthOptions {
  required?: boolean;
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { required = false, redirectTo = '/auth/signin', redirectIfFound = false } = options;
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Make sure the component is mounted before using client-side features
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = !!session;

  useEffect(() => {
    // Do nothing while loading or not mounted (SSR)
    if (loading || !mounted) return;

    // If auth is required and user is not authenticated, redirect to login
    if (required && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If redirectIfFound is true and user is authenticated, redirect away
    if (redirectIfFound && isAuthenticated) {
      router.push('/');
      return;
    }
  }, [loading, isAuthenticated, required, redirectIfFound, redirectTo, router, mounted]);

  // During SSR, return a default state to avoid hydration errors
  if (!mounted) {
    return {
      session: null,
      loading: true,
      isAuthenticated: false,
      signIn,
      signOut,
      user: null,
    };
  }

  return {
    session,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    user: session?.user,
  };
}
