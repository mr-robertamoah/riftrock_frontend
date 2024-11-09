import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useDarkMode } from '../composables/useDarkMode';

export const Hero = (
  { dark = false, onToggle = (theme: boolean) => null } : 
  { dark: boolean, onToggle: (theme: boolean) => void }) => {

  const {isDarkMode, setIsDarkMode} = useDarkMode({ dark });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    onToggle(isDarkMode)
  }, [isDarkMode])

  return (
    <div className={`relative h-screen flex items-center justify-center overflow-hidden dark:bg-black bg-white`}>
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1578323851363-cf6c1a0ed8e6?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 dark:bg-black/60 bg-white" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold dark:text-white text-black  mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Pioneering the Future of
          <span className="block text-yellow-800 dark:text-yellow-500">Mining Services</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl dark:text-gray-300 text-gray-600 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Leading the industry with innovative solutions and sustainable practices
        </motion.p>
        
        <motion.button 
          className="dark:bg-yellow-500 bg-yellow-700 text-slate-300 dark:text-slate-900 px-8 py-3 rounded-full font-semibold
                     hover:bg-yellow-600 dark:hover:bg-yellow-400 transition-colors duration-300 transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Explore Our Services
        </motion.button>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <ChevronDown className="w-8 h-8 dark:text-white text-black" />
      </motion.div>

      <ThemeToggle 
        onToggle={toggleTheme} 
        isDarkMode={isDarkMode}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="absolute top-16 right-16 mt-2"
      >
      </ThemeToggle>
    </div>
  );
};