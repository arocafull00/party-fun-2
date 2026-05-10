import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#005ab2',
  secondary: '#b31e03',
  tertiary: '#3f6600',
  background: '#fff5ec',
  text: '#005ab2',
  textLight: '#fff5ec',
  backgroundLight: '#fff5ec',
  primaryLight: '#2196f3',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const typography = {
  families: {
    display: 'PlusJakartaSans_800ExtraBold',
    heading: 'PlusJakartaSans_800ExtraBold',
    body: 'BeVietnamPro_400Regular',
    bodyBold: 'BeVietnamPro_700Bold',
  },
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

export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    background: colors.background,
    text: colors.text,
    textLight: colors.textLight,
  },
  roundness: borderRadius.md,
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: typography.families.display,
      fontWeight: '800',
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: typography.families.heading,
      fontWeight: '800',
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: typography.families.bodyBold,
      fontWeight: '700',
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: typography.families.body,
      fontWeight: '400',
    },
  },
  elevation: {
    level0: 0,
    level1: 1,
    level2: 3,
    level3: 6,
    level4: 8,
    level5: 12,
  },
};