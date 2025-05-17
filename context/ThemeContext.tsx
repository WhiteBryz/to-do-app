// context/ThemeContext.tsx
import { darkTheme, lightTheme } from '@/theme/theme';
import React, { createContext, useContext } from 'react';
import { useSettings } from './SettingsContext';

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = useSettings();
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
