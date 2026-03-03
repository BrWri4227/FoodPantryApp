/**
 * Shared theme constants for consistent styling.
 * Light and dark palettes for theme switching.
 */
export const lightColors = {
  primary: '#4F7942',
  primaryLight: '#6B9B5A',
  background: '#f8f8f8',
  surface: '#FFFFFF',
  error: '#990F02',
  text: '#333333',
  textSecondary: '#555555',
  border: '#ccc',
  tabBar: '#4F7942',
};

export const darkColors = {
  primary: '#6B9B5A',
  primaryLight: '#8BC77A',
  background: '#121212',
  surface: '#1F2933',
  error: '#CF6679',
  text: '#E0E0E0',
  textSecondary: '#B0B0B0',
  border: '#333',
  tabBar: '#2D4A26',
};

/** @deprecated Use theme from ThemeContext (lightColors/darkColors) */
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};
