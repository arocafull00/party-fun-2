import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_700Bold,
} from "@expo-google-fonts/be-vietnam-pro";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import { database } from "../src/database/database";
import { theme } from "../src/theme/theme";
import { CustomScreen } from "../src/shared/components/CustomScreen";
import { GlobalMusicProvider } from "../src/shared/context/global-music-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_800ExtraBold,
    BeVietnamPro_400Regular,
    BeVietnamPro_700Bold,
  });
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

  if (!fontsLoaded) {
    return null;
  }

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
          <StatusBar style="dark" hidden={true} />
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
            <Text style={styles.loadingText}>Inicializando Funny Words...</Text>
          </CustomScreen>
          <StatusBar style="dark" hidden={true} />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <GlobalMusicProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" options={{ title: "Funny Words" }} />
            <Stack.Screen
              name="create-deck"
              options={{ title: "Crear Mazo" }}
            />
            <Stack.Screen
              name="deck-management"
              options={{ title: "Mis Mazos" }}
            />
            <Stack.Screen
              name="new-game"
              options={{ title: "Nueva Partida" }}
            />
            <Stack.Screen
              name="game-turn"
              options={{
                title: "Juego",
                headerLeft: () => null,
              }}
            />
            <Stack.Screen
              name="round-result"
              options={{
                title: "Resultados de Ronda",
                headerLeft: () => null,
              }}
            />
            <Stack.Screen
              name="game-end"
              options={{
                title: "Fin del Juego",
                headerLeft: () => null,
              }}
            />
            <Stack.Screen
              name="statistics"
              options={{ title: "Estadísticas" }}
            />

            <Stack.Screen
              name="turn-review"
              options={{ title: "Revisar Turno" }}
            />
          </Stack>
          <StatusBar style="dark" hidden={true} />
        </GlobalMusicProvider>
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
    color: theme.colors.text,
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
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubtitle: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
  },
});
