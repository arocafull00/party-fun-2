import { MD3LightTheme } from 'react-native-paper';

// Modern glassmorphism color palette
export const colors = {
  // Primary colors with glassmorphism
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary colors
  secondary: '#EC4899', // Pink
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',
  
  // Accent colors
  accent: '#10B981', // Emerald
  accentLight: '#34D399',
  accentDark: '#059669',
  
  // Neutral colors
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Team colors
  teamBlue: '#3B82F6',
  teamBlueLight: '#60A5FA',
  teamBlueDark: '#2563EB',
  teamRed: '#EF4444',
  teamRedLight: '#F87171',
  teamRedDark: '#DC2626',
  
  // Status colors
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  
  // Glassmorphism colors
  glass: {
    primary: 'rgba(99, 102, 241, 0.1)',
    secondary: 'rgba(236, 72, 153, 0.1)',
    surface: 'rgba(255, 255, 255, 0.1)',
    surfaceVariant: 'rgba(255, 255, 255, 0.05)',
    backdrop: 'rgba(0, 0, 0, 0.3)',
    card: 'rgba(255, 255, 255, 0.15)',
    cardVariant: 'rgba(255, 255, 255, 0.08)',
  },
  
  // Gradients
  gradients: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#EC4899', '#F59E0B'],
    background: ['#0F172A', '#1E293B'],
    glass: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)'],
    teamBlue: ['#3B82F6', '#1D4ED8'],
    teamRed: ['#EF4444', '#DC2626'],
    success: ['#10B981', '#059669'],
    error: ['#EF4444', '#DC2626'],
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    glass: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },
  
  // Typography
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    accent: '#6366F1',
  },
  
  // Backgrounds
  background: {
    primary: '#0F172A',
    secondary: '#1E293B',
    surface: '#FFFFFF',
    surfaceVariant: '#F8FAFC',
  },
  
  // Borders
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.3)',
  },
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

// Glassmorphism effects
export const glassmorphism = {
  light: {
    backgroundColor: colors.glass.surface,
    borderColor: colors.border.light,
    borderWidth: 1,
    ...colors.shadows.glass,
  },
  medium: {
    backgroundColor: colors.glass.card,
    borderColor: colors.border.medium,
    borderWidth: 1,
    ...colors.shadows.glass,
  },
  heavy: {
    backgroundColor: colors.glass.cardVariant,
    borderColor: colors.border.dark,
    borderWidth: 1,
    ...colors.shadows.lg,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.accent,
    surface: colors.background.surface,
    surfaceVariant: colors.background.surfaceVariant,
    background: colors.background.primary,
    onBackground: colors.text.inverse,
    onSurface: colors.text.primary,
    outline: colors.neutral[300],
    error: colors.error,
    success: colors.success,
  },
};