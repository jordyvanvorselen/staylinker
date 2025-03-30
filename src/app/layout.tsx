import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ThemeProvider from '../components/ThemeProvider';
import Header from '../components/Header';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StayLinker',
  description: 'Stay connected with your favorites',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
