import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useDarkMode } from '../composables/useDarkMode';

export const Hero = ({ dark = false } : { dark: boolean }) => {

  const {isDarkMode, setIsDarkMode} = useDarkMode({ dark });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Pioneering the Future
          <span className="block text-yellow-500">of Mining</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Leading the industry with innovative solutions and sustainable practices
        </motion.p>
        
        <motion.button 
          className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-full font-semibold
                     hover:bg-yellow-400 transition-colors duration-300 transform hover:scale-105"
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
        <ChevronDown className="w-8 h-8 text-white" />
      </motion.div>

      <ThemeToggle 
        onToggle={toggleTheme} 
        isDarkMode={isDarkMode}
        className="absolute top-16 right-16 mt-2"
      >
      </ThemeToggle>
    </div>
  );
};