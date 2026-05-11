import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { borderRadius, colors, typography } from '../../theme/theme';

interface HeroCardProps {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  title,
  subtitle,
  style,
  children,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontFamily: typography.families.heading,
    fontSize: typography.sizes.xxxl,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text,
    fontFamily: typography.families.body,
    fontSize: typography.sizes.sm,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#ffffff',
  },
});
