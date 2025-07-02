import React from 'react';
import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../src/theme/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "¡Oops! Esta pantalla no existe." }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>404</Text>
          <Text style={styles.message}>¡Página no encontrada!</Text>
          <Text style={styles.subtitle}>
            La pantalla que buscas no existe o ha sido movida.
          </Text>
          <Link href="/" asChild>
            <Button mode="contained" style={styles.button}>
              Ir al Inicio
            </Button>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
}); 