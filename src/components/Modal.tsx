import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: (event: any) => void;
  isDarkMode: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-auto max-h-full overflow-y-auto`}
      >
        <button
          onClick={(event) => onClose(event)}
          type='button'
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
        >
          &times;
        </button>
        <div className={`text-black dark:text-white`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;