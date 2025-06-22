// src/context/ThemeContext.jsx
import { createContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Function to toggle the theme
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Update localStorage and apply dark/light mode
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');

    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.transition = 'background-color 0.3s ease-in-out, color 0.3s ease-in-out';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.transition = 'background-color 0.3s ease-in-out, color 0.3s ease-in-out';
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
      <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
    </ThemeContext.Provider>
  );
};

// ✅ Animated Theme Toggle Component
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleTheme }) => {
  return (
    <div className="theme-toggle-container">
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.button
            key="dark"
            className="theme-toggle dark"
            onClick={toggleTheme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <FaSun className="icon sun" />
          </motion.button>
        ) : (
          <motion.button
            key="light"
            className="theme-toggle light"
            onClick={toggleTheme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <FaMoon className="icon moon" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
