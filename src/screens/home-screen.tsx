import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, Surface, Icon } from "react-native-paper";
import { useRouter } from "expo-router";

import { database, Mazo } from "../database/database";
import { useGameStore } from "../store/game-store";
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { HeroCard } from "../shared/components/HeroCard";
import { BouncyButton } from "../shared/components/BouncyButton";

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
      <CustomScreen>
        <View style={styles.emptyContainer}>
          <HeroCard
            title="Sin mazos"
            subtitle="Necesitas crear al menos un mazo para jugar."
            style={styles.emptyCard}
          >
            <Icon source="cards-outline" size={80} />
            <Text style={styles.emptyDescription}>
              Necesitas crear al menos un mazo de cartas para jugar
            </Text>
            <BouncyButton
              label="Crear mazos"
              onPress={() => router.push("/create-deck")}
              style={styles.createButton}
              icon="plus"
            />
          </HeroCard>
        </View>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>PARTY FUN</Text>
          <Text style={styles.subtitle}>Game</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <HeroCard
            title="Nuevo juego"
            subtitle="Inicia una partida de Kinetic Play."
            style={styles.mainCard}
          >
            <BouncyButton
              label="Nuevo juego"
              onPress={handleNewGame}
              style={styles.playButton}
              icon="play"
            />

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
          </HeroCard>
          <View style={styles.actionButtons}>
            <BouncyButton
              label="Mis mazos"
              onPress={() => router.push("/deck-management")}
              style={styles.actionButton}
              icon="cards"
            />

            <BouncyButton
              label="Estadisticas"
              onPress={() => router.push("/statistics")}
              style={styles.actionButton}
              tone="secondary"
              icon="chart-line"
            />
          </View>
        </ScrollView>
      </View>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "transparent",
  },
  header: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.display,
    fontWeight: "800",
    color: colors.primary,
    fontFamily: typography.families.display,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.sizes.xxxl,
    color: colors.accent,
    fontStyle: "italic",
    fontFamily: typography.families.body,
    textAlign: "center",
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  mainCard: {
    marginBottom: spacing.lg,
  },
  playButton: {
    marginBottom: spacing.md,
    width: "100%",
    borderRadius: borderRadius.xl,
  },
  continueButton: {
    borderColor: colors.primary,
    borderWidth: 0,
    width: "100%",
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceContainerLow,
  },
  continueButtonContent: {
    height: 50,
  },
  continueButtonLabel: {
    fontSize: typography.sizes.md,
    fontWeight: "bold",
    color: colors.primary,
  },
  actionButtons: {
    gap: spacing.md,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    borderRadius: borderRadius.xl,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    maxWidth: 460,
    width: "100%",
  },
  emptyDescription: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  createButton: {
    borderRadius: borderRadius.xl,
  },
});

