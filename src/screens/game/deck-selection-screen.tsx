import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { router } from "expo-router";

import { database, Mazo } from "../../database/database";
import { useGameStore } from "../../store/game-store";
import { colors, spacing, typography } from "../../theme/theme";
import { CustomScreen } from "../../shared/components/CustomScreen";
import { AppHeader } from "../../shared/components/app-header";
import { AppHeaderIconButton } from "../../shared/components/app-header-icon-button";
import { DeckSelectionPhase } from "./components";

const DeckSelectionScreen: React.FC = () => {
  const { decks, setDecks, setSelectedDeck, setCards } = useGameStore();

  const [isLoading, setIsLoading] = useState(false);
  const [cardCounts, setCardCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      const decksData = await database.getMazos();
      console.log("Loaded decks:", decksData);
      setDecks(decksData);

      // Load card counts for all decks
      const counts: Record<number, number> = {};
      await Promise.all(
        decksData.map(async (deck) => {
          const cards = await database.getCartasByMazo(deck.id);
          counts[deck.id] = cards.length;
        })
      );
      setCardCounts(counts);
    } catch (error) {
      console.error("Error loading decks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDeck = async (deck: Mazo) => {
    try {
      setSelectedDeck(deck);
      const cards = await database.getCartasByMazo(deck.id);
      setCards(cards);

      // Check if we can start the game immediately
      const currentState = useGameStore.getState();
      if (
        currentState.teams.azul.players.length > 0 &&
        currentState.teams.rojo.players.length > 0
      ) {
        // Start the game immediately
        const cardsList = cards.map((c) => c.texto);
        currentState.startGame(cardsList);
        router.push("/game-turn");
      } else {
        // Go back to new game screen to configure teams
        router.back();
      }
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  };

  const handleCreateDeck = () => {
    router.push("/create-deck");
  };

  return (
    <CustomScreen
      contentStyle={styles.container}
      header={
        <AppHeader
          title="MAZOS"
          left={
            <AppHeaderIconButton
              icon="close"
              onPress={() => router.back()}
            />
          }
          right={
            <AppHeaderIconButton icon="refresh" onPress={loadDecks} />
          }
        />
      }
    >
      <View style={styles.flexFill}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {decks.length > 0 && !isLoading && (
            <DeckSelectionPhase
              decks={decks}
              onSelectDeck={handleSelectDeck}
              onCreateDeck={handleCreateDeck}
              cardCounts={cardCounts}
            />
          )}

          {decks.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No hay mazos disponibles
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Crea un mazo primero para poder jugar
              </Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>Cargando mazos...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  flexFill: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xxxl,
  },
  emptyStateText: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text + "80",
    textAlign: "center",
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
});

export default DeckSelectionScreen;
