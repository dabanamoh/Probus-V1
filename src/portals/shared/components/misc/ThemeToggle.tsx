import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";

interface ThemeToggleProps {
  variant?: 'default' | 'icon-only';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'default', className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'icon-only') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ${className}`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-slate-400" />
            ) : (
              <Sun className="w-5 h-5 text-slate-300" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme === 'light' ? 'dark' : 'light'} mode</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`flex items-center gap-2 ${className}`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
