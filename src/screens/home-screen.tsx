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
  Surface,
  Icon,
} from "react-native-paper";
import { router, useRouter } from "expo-router";

import { database, Mazo } from "../database/database";
import { useGameStore } from "../store/game-store";
import { colors } from "../theme/theme";

export const HomeScreen: React.FC = () => {
  const { setDecks, decks } = useGameStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasOngoingGame, setHasOngoingGame] = useState(false);

  useEffect(() => {
    loadDecks();
    checkOngoingGame();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const decksData = await database.getMazos();
      setDecks(decksData);
    } catch (error) {
      console.error("Error loading decks:", error);
      Alert.alert("Error", "No se pudieron cargar los mazos");
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

  const handleDeleteDeck = async (deck: Mazo) => {
    Alert.alert(
      "Eliminar Mazo",
      `¿Estás seguro de que quieres eliminar "${deck.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await database.deleteMazo(deck.id);
              await loadDecks();
            } catch (error) {
              console.error("Error deleting deck:", error);
              Alert.alert("Error", "No se pudo eliminar el mazo");
            }
          },
        },
      ]
    );
  };

  const handleNewGame = () => {
    if (decks.length === 0) {
      Alert.alert(
        "Sin mazos",
        "Necesitas crear al menos un mazo de cartas para jugar",
        [{ text: "OK" }]
      );
      return;
    }
    router.push("/new-game");
  };

  const handleContinueGame = async () => {
    // TODO: Load ongoing game state and navigate to appropriate screen
    Alert.alert("Continuar Partida", "Funcionalidad en desarrollo");
  };

  if (decks.length === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.emptyContainer}>
        <Surface style={styles.emptyCard} elevation={2}>
          <Icon source="cards-outline" size={80} />
          <Text style={styles.emptyTitle}>Sin mazos</Text>
          <Text style={styles.emptyDescription}>
            Necesitas crear al menos un mazo de cartas para jugar
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push("/create-deck")}
            style={styles.createButton}
            icon="plus"
          >
            CREAR CARTAS
          </Button>
        </Surface>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
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
            onPress={() => router.push("/create-deck")}
            style={[styles.actionButton, { backgroundColor: colors.tertiary }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
            icon="cards"
          >
            CREAR CARTAS
          </Button>

          <Button
            mode="contained"
            onPress={() => router.push("/statistics")}
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
            icon="chart-line"
          >
            ESTADÍSTICAS
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
});

