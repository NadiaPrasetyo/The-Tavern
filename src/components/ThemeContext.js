import React, { createContext, useState, useEffect } from 'react';

// Create ThemeContext
export const ThemeContext = createContext();

// ThemeProvider component that wraps your entire app
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(storedDarkMode);
    document.body.classList.toggle('dark', storedDarkMode);
  }, []);

  const updatePreference = async (darkMode) => {
    const username = localStorage.getItem('username');
    const preference = { DarkMode: darkMode };

    const response = await fetch('/api/update-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, preferences: preference }),
    });

    const data = await response.json();
    console.log("Preferences Updated!", data);
  };

  // Toggle dark mode and sync with backend
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.body.classList.toggle('dark', newMode);
      localStorage.setItem('isDarkMode', newMode);
      updatePreference(newMode); // Sync with backend
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
