"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthContextProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children, session }: AuthContextProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
