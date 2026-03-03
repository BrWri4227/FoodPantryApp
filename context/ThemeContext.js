import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../constants/theme';

const THEME_STORAGE_KEY = '@simplepantry_theme';

export const ThemeContext = createContext({
  theme: 'light',
  colors: lightColors,
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      } else {
        setThemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    });
  }, [systemColorScheme]);

  const setTheme = useCallback((mode) => {
    const next = mode === 'dark' ? 'dark' : 'light';
    setThemeState(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
