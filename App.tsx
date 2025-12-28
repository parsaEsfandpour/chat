
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { ImageGenView } from './components/ImageGenView';
import { ImageEditView } from './components/ImageEditView';
import { SearchView } from './components/SearchView';
import { MapsView } from './components/MapsView';
import type { Theme, Language, View } from './types';
import { LOCALES } from './constants';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<View>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const T = useMemo(() => LOCALES[language], [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.lang = language;
    root.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = language === 'fa' ? "'Vazirmatn', sans-serif" : "'Poppins', sans-serif";
  }, [theme, language]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'fa' : 'en'));
  };

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatView T={T} />;
      case 'imageGen':
        return <ImageGenView T={T} />;
      case 'imageEdit':
        return <ImageEditView T={T} />;
      case 'search':
        return <SearchView T={T} />;
      case 'maps':
        return <MapsView T={T} />;
      default:
        return <ChatView T={T} />;
    }
  };

  return (
    <div className={`flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 ${language === 'fa' ? 'font-vazir' : 'font-sans'}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black -z-10">
            <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,40,217,0.35)] opacity-50 blur-[80px]"></div>
        </div>
        <Sidebar activeView={activeView} setActiveView={setActiveView} T={T} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header
                theme={theme}
                toggleTheme={toggleTheme}
                language={language}
                toggleLanguage={toggleLanguage}
                T={T}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {renderView()}
            </main>
        </div>
    </div>
  );
};

export default App;
