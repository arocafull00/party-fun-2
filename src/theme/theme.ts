import { MD3LightTheme } from 'react-native-paper';

// Modern glassmorphism color palette
export const colors = {
  text: '#0a1110',
  background: '#f9fcfc',
  primary: '#4bbcaa',
  secondary: '#9ae1d6',
  accent: '#5bd9c5',
  surface: '#ffffff',
  error: '#ff6b6b',
  success: '#51cf66',
  warning: '#ffd43b',
  textLight: '#ffffff',
  onBackground: '#0a1110',
  onSurface: '#0a1110',
  onSurfaceVariant: '#666666',
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius system
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Typography scale
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
};

// Create a proper theme that extends MD3LightTheme
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onBackground: colors.onBackground,
    onSurface: colors.onSurface,
    onSurfaceVariant: colors.onSurfaceVariant,
    text: colors.text,
    textLight: colors.textLight,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
  },
  // Ensure elevation levels are properly defined
  elevation: {
    level0: 0,
    level1: 1,
    level2: 3,
    level3: 6,
    level4: 8,
    level5: 12,
  },
};