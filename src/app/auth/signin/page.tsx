'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Map, Car, CheckCircle2 } from 'lucide-react';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/' });
    } catch (_error) {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-full flex items-center justify-center relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-accent/5 via-base-200 to-accent/10">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

      {/* Content */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl h-full relative z-10 flex flex-col justify-around py-12 sm:py-16">
        {/* Hero Text */}
        <header className="text-center pt-8 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-base-content leading-tight">
            Your Travel <span className="text-primary">Timeline</span>, <br className="sm:hidden" />
            <span className="sm:inline">Beautifully </span>Organized
          </h1>
          <p className="text-base sm:text-lg text-base-content/80 mb-6">
            StayLinker helps you visualize your travel plans by connecting stays and showing the
            journeys between them.
          </p>

          {/* Benefits */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Map className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Plan Visually</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Track Distances</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Identify Gaps</span>
            </div>
          </div>
        </header>

        {/* Sign In Button (at the bottom) */}
        <div className="text-center">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="btn btn-primary w-full sm:w-auto btn-lg gap-2 shadow-lg hover:shadow-primary/20 transition-all"
            aria-label="Sign in with Google"
            tabIndex={0}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
