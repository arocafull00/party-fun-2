import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import { database } from "../src/database/database";
import { theme } from "../src/theme/theme";
import { CustomScreen } from "../src/shared/components/CustomScreen";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await database.init();
      setIsReady(true);
    } catch (err) {
      console.error("App initialization failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (error) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <CustomScreen containerStyle={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error de Inicialización</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Text style={styles.errorSubtitle}>
              Por favor, reinicia la aplicación
            </Text>
          </CustomScreen>
          <StatusBar style="light" />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <CustomScreen containerStyle={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Inicializando PartyFun...</Text>
          </CustomScreen>
          <StatusBar style="light" />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" options={{ title: "PartyFun" }} />
            <Stack.Screen name="create-deck" options={{ title: "Crear Mazo" }} />
            <Stack.Screen name="new-game" options={{ title: "Nueva Partida" }} />
            <Stack.Screen 
              name="game-turn" 
              options={{ 
                title: "Juego",
                headerLeft: () => null 
              }} 
            />
            <Stack.Screen 
              name="round-result" 
              options={{ 
                title: "Resultados de Ronda",
                headerLeft: () => null 
              }} 
            />
            <Stack.Screen 
              name="game-end" 
              options={{ 
                title: "Fin del Juego",
                headerLeft: () => null 
              }} 
            />
            <Stack.Screen name="statistics" options={{ title: "Estadísticas" }} />
          </Stack>
        <StatusBar style="light" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: theme.colors.onBackground,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.error,
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.onBackground,
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
}); 