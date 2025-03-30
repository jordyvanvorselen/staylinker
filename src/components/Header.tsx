'use client';

import { Link } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProvider';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="p-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        <Link className="h-5 w-5" />
        <span className="font-semibold text-lg">StayLinker</span>
      </div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </header>
  );
};

export default Header;
