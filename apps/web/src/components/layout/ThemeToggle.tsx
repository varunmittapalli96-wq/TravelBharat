'use client';

import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
      aria-label="Toggle Dark Mode"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400" />
      )}
    </button>
  );
}
