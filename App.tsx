import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import HomeScreen from './src/screens/home-screen';
import CreateBatteryScreen from './src/screens/create-battery-screen';
import NewGameScreen from './src/screens/new-game-screen';
import GameTurnScreen from './src/screens/game-turn-screen';
import RoundResultScreen from './src/screens/round-result-screen';
import GameEndScreen from './src/screens/game-end-screen';
import StatisticsScreen from './src/screens/statistics-screen';

import { database } from './src/database/database';
import { theme } from './src/theme/theme';

const Stack = createStackNavigator();

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      console.log('Initializing database...');
      await database.init();
      setIsDbInitialized(true);
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setDbError(error instanceof Error ? error.message : 'Unknown database error');
    }
  };

  if (dbError) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error de Base de Datos</Text>
            <Text style={styles.errorMessage}>{dbError}</Text>
            <Text style={styles.errorSubtitle}>
              Por favor, reinicia la aplicación
            </Text>
          </View>
          <StatusBar style="light" />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!isDbInitialized) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Inicializando PartyFun...</Text>
          </View>
          <StatusBar style="light" />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'PartyFun',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CreateBattery"
              component={CreateBatteryScreen}
              options={{
                title: 'Crear Batería',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NewGame"
              component={NewGameScreen}
              options={{
                title: 'Nueva Partida',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="GameTurn"
              component={GameTurnScreen}
              options={{
                title: 'Juego',
                headerLeft: () => null, // Disable back button during game
              }}
            />
            <Stack.Screen
              name="RoundResult"
              component={RoundResultScreen}
              options={{
                title: 'Resultados de Ronda',
                headerLeft: () => null, // Disable back button
              }}
            />
            <Stack.Screen
              name="GameEnd"
              component={GameEndScreen}
              options={{
                title: 'Fin del Juego',
                headerLeft: () => null, // Disable back button
              }}
            />
            <Stack.Screen
              name="Statistics"
              component={StatisticsScreen}
              options={{
                title: 'Estadísticas',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: theme.colors.onBackground,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.onBackground,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
