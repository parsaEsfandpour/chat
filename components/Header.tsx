
import React from 'react';
import { motion } from 'framer-motion';
import type { Theme, Language } from '../types';
import { SunIcon, MoonIcon, MenuIcon } from './Icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  T: any;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, language, toggleLanguage, T, toggleSidebar }) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">{T.appName}</h1>
      </div>
      <div className="flex items-center gap-4">
        <motion.button
          onClick={toggleLanguage}
          className="px-3 py-1.5 text-sm font-semibold rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          {language === 'en' ? 'FA' : 'EN'}
        </motion.button>
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          whileTap={{ scale: 0.9, rotate: 30 }}
        >
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </motion.button>
      </div>
    </header>
  );
};
