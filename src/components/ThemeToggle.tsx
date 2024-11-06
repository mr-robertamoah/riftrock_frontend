import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className: string;
  title: string;
}

export const ThemeToggle = ({ 
  isDarkMode, 
  onToggle, 
  className = "",
  title = "" ,
}: ThemeToggleProps) => {
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
      title={title}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`${className} p-3 rounded-full transition-colors duration-300
        bg-gray-800 text-yellow-500 dark:bg-white dark:text-gray-800
        border-2 dark:border-yellow-500 border-yellow-800`}
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