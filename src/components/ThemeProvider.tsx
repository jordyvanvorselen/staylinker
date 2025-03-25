'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('dark');
  
  // Initialize theme from localStorage when component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      {children}
    </ThemeContext.Provider>
  );
}
