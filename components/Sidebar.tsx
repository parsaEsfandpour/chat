
import React from 'react';
import { motion } from 'framer-motion';
import type { View } from '../types';
import { ChatIcon, ImageIcon, EditIcon, SearchIcon, MapIcon } from './Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  T: any;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const navItems = [
  { id: 'chat', icon: ChatIcon },
  { id: 'imageGen', icon: ImageIcon },
  { id: 'imageEdit', icon: EditIcon },
  { id: 'search', icon: SearchIcon },
  { id: 'maps', icon: MapIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, T, isSidebarOpen, setIsSidebarOpen }) => {
  const NavItem = ({ item }: { item: { id: View; icon: React.FC<{className?: string}> }}) => {
    const isActive = activeView === item.id;
    return (
      <li className="relative">
        <button
          onClick={() => {
            setActiveView(item.id);
            setIsSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <item.icon className="w-6 h-6 flex-shrink-0" />
          <span className="font-medium">{T.sidebar[item.id]}</span>
        </button>
        {isActive && (
          <motion.div
            layoutId="active-nav-item"
            className="absolute inset-0 bg-purple-600/40 rounded-lg -z-10"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </li>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <aside
        className={`absolute md:relative flex-shrink-0 w-64 h-full bg-gray-900/80 dark:bg-black/50 backdrop-blur-lg p-4 flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 rtl:-translate-x-0' : '-translate-x-full rtl:translate-x-full'} md:translate-x-0 md:rtl:-translate-x-0`}
      >
        <div className="flex-shrink-0 pb-4 mb-4 border-b border-white/10">
            <h2 className="text-2xl font-bold text-center text-white">Parsa AI</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item as { id: View; icon: React.FC<{className?: string}>}} />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
