'use client';

import { Moon, Sun } from 'lucide-react';

type ThemeToggleProps = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleTheme();
    }
  };

  return (
    <button
      className="btn btn-circle btn-ghost"
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      aria-label={`Toggle to ${theme === 'light' ? 'dark' : 'light'} theme`}
      tabIndex={0}
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
