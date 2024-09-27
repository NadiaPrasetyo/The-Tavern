import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const ThemeContext = createContext();

// ThemeProvider component that will wrap your entire app
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage when the app starts
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    console.log('Stored dark mode:', storedDarkMode);
    if (storedDarkMode !== null) {
      const isDark = storedDarkMode === 'true'; // Convert string to boolean
      setIsDarkMode(isDark);
      document.body.classList.toggle('dark', isDark);
    }
  }, []);
  
  // Toggle dark mode and sync with backend
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.body.classList.toggle('dark', newMode);
      localStorage.setItem('isDarkMode', newMode);
      console.log('Dark mode:', localStorage.getItem('isDarkMode'));
  
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};