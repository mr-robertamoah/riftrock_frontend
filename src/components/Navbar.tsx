import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RiftRockLogo from './RiftRockLogo';

export const Navbar = ({ isDarkMode = false } : { isDarkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate()

  function toggleLogin() {
    setShowLogin(!showLogin)
  }

  function goToLogin() {
    navigate('/login')
  }

  return (
    <nav className="fixed w-full dark:bg-slate-900/95 bg-yellow-800 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {
          showLogin && (
            <div
              className='absolute top-14 left-3 w-56
                dark:bg-white bg-slate-700 h-24 rounded flex justify-center items-center'
            >
              <div className='w-full my-3'>
                <div
                  className='mb-4 rounded-full bg-white text-slate-700 p-2 w-6 h-6
                    flex justify-center items-center ml-auto mr-2 cursor-pointer
                    dark:bg-slate-600 dark:text-slate-300'
                  onClick={toggleLogin}
                >X</div>
                <div
                  className='dark:bg-slate-300 bg-slate-900 text-white w-fit mx-auto cursor-pointer
                    dark:text-slate-900 py-1 px-4 rounded border-b-2 border-yellow-700'
                  onClick={goToLogin}
                >login</div>
              </div>
            </div>
          )
        }
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex-shrink-0 flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div onClick={toggleLogin}>
              <RiftRockLogo 
                className='w-10 h-10'
                isDarkMode={isDarkMode}
              />
            </div>
            <span className="text-white font-bold text-xl">RiftRock Mining Services</span>
          </motion.div>
          
          <div className="ml-10 hidden md:block w-fit overflow-hidden overflow-x-auto">
            <div className="flex w-fit items-baseline justify-end space-x-4">
              {['About', 'Equipment', 'Projects', 'Services', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {['About', 'Equipment', 'Projects', 'Services', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              {item}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};