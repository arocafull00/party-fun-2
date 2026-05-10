import React from 'react';
import { Stack, router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { borderRadius, colors, spacing, typography } from '../src/theme/theme';
import { CustomScreen } from '../src/shared/components/CustomScreen';
import { BouncyButton } from '../src/shared/components/BouncyButton';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "¡Oops! Esta pantalla no existe." }} />
      <CustomScreen contentStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>404</Text>
          <Text style={styles.message}>¡Página no encontrada!</Text>
          <Text style={styles.subtitle}>
            La pantalla que buscas no existe o ha sido movida.
          </Text>
          <BouncyButton label="Ir al inicio" onPress={() => router.push('/')} variant="primary" />
        </View>
      </CustomScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 72,
    fontWeight: '800',
    fontFamily: typography.families.heading,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    fontFamily: typography.families.heading,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    borderRadius: borderRadius.xl,
    minWidth: 200,
  },
}); 