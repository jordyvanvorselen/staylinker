// This file extends the Session and JWT types via module augmentation
// ESLint doesn't understand TypeScript's module augmentation pattern, so we disable the warnings
// eslint-disable-next-line no-unused-vars
import type { NextAuth } from 'next-auth';

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    id?: string;
  }
}
