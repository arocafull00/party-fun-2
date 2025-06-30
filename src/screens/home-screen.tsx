import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Button,
  Card,
  Title,
  IconButton,
  Divider,
  Chip,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { database, Bateria } from "../database/database";
import { useGameStore } from "../store/game-store";
import { colors } from "../theme/theme";

type RootStackParamList = {
  Home: undefined;
  CreateBattery: undefined;
  NewGame: undefined;
  Statistics: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { setBatteries, batteries } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [hasOngoingGame, setHasOngoingGame] = useState(false);

  useEffect(() => {
    loadBatteries();
    checkOngoingGame();
  }, []);

  const loadBatteries = async () => {
    try {
      const batteriesData = await database.getBaterias();
      setBatteries(batteriesData);
    } catch (error) {
      console.error("Error loading batteries:", error);
      Alert.alert("Error", "No se pudieron cargar las baterías");
    } finally {
      setLoading(false);
    }
  };

  const checkOngoingGame = async () => {
    try {
      const ongoingGame = await database.getPartidaActual();
      setHasOngoingGame(!!ongoingGame);
    } catch (error) {
      console.error("Error checking ongoing game:", error);
    }
  };

  const handleDeleteBattery = async (battery: Bateria) => {
    Alert.alert(
      "Eliminar Batería",
      `¿Estás seguro de que quieres eliminar "${battery.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await database.deleteBateria(battery.id);
              loadBatteries();
            } catch (error) {
              console.error("Error deleting battery:", error);
              Alert.alert("Error", "No se pudo eliminar la batería");
            }
          },
        },
      ]
    );
  };

  const handleNewGame = () => {
    if (batteries.length === 0) {
      Alert.alert(
        "Sin baterías",
        "Necesitas crear al menos una batería de palabras para jugar",
        [{ text: "OK" }]
      );
      return;
    }
    navigation.navigate("NewGame");
  };

  const handleContinueGame = async () => {
    // TODO: Load ongoing game state and navigate to appropriate screen
    Alert.alert("Continuar Partida", "Funcionalidad en desarrollo");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PARTY FUN</Text>
        <Text style={styles.subtitle}>Game</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Game Button */}
        <View style={styles.mainCard}>
          <Button
            mode="contained"
            onPress={handleNewGame}
            style={styles.playButton}
            contentStyle={styles.playButtonContent}
            labelStyle={styles.playButtonLabel}
            icon="play"
          >
            NUEVO JUEGO
          </Button>

          {hasOngoingGame && (
            <Button
              mode="outlined"
              onPress={handleContinueGame}
              style={styles.continueButton}
              contentStyle={styles.continueButtonContent}
              labelStyle={styles.continueButtonLabel}
              icon="play-circle-outline"
            >
              CONTINUAR PARTIDA
            </Button>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("CreateBattery")}
            style={[styles.actionButton, { backgroundColor: colors.tertiary }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
            icon="cards"
          >
            CREAR PALABRAS
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate("Statistics")}
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
            icon="chart-line"
          >
            ESTADÍSTICAS
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#FFD700",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    maxWidth: 600,
    alignSelf: "center",
  },
  mainCard: {
    marginBottom: 30,
    backgroundColor: "transparent",
  },
  mainCardContent: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  playButton: {
    backgroundColor: colors.success,
    marginBottom: 15,
    width: "100%",
    borderRadius: 25,
  },
  playButtonContent: {
    height: 60,
  },
  playButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
  },
  continueButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    width: "100%",
    borderRadius: 25,
  },
  continueButtonContent: {
    height: 50,
  },
  continueButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  actionButtons: {
    gap: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    borderRadius: 25,
  },
  actionButtonContent: {
    height: 55,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
  },
});

export default HomeScreen;
