import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const ThemeContext = createContext();

// ThemeProvider component that will wrap your entire app
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage when the app starts
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    if (storedDarkMode !== null) {
      const isDark = storedDarkMode === 'true'; // Convert string to boolean
      setIsDarkMode(isDark);
      document.body.classList.toggle('dark', isDark);
    }
  }, []);

  const updatePreference = async (preference) => {
    const username = localStorage.getItem('username');
    const response = await fetch('/api/update-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        preferences: preference,
      }),
    });
    const data = await response.json();
    console.log('Preferences updated:', data);
  };
  
  // Toggle dark mode and sync with backend
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.body.classList.toggle('dark', newMode);
      localStorage.setItem('isDarkMode', newMode);
  
      // Sync with backend
      updatePreference({ DarkMode: newMode });
  
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
