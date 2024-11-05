import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className: string;
}

export const ThemeToggle = ({ isDarkMode, onToggle, className = "" }: ThemeToggleProps) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      onToggle();
    }
  }, []);

  const handleToggle = () => {
    onToggle();
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`${className} p-3 rounded-full transition-colors duration-300
        dark:bg-gray-800 dark:text-yellow-500 bg-white text-gray-800
        border-2 dark:border-yellow-500 border-gray-300`}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </motion.button>
  );
};