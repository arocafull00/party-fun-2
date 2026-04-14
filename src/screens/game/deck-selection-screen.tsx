import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, IconButton } from "react-native-paper";
import { router } from "expo-router";

import { database, Mazo } from "../../database/database";
import { useGameStore } from "../../store/game-store";
import { borderRadius, colors, spacing, typography } from "../../theme/theme";
import { CustomScreen } from "../../shared/components/CustomScreen";

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2; // 2 cards per row with margins

const DeckSelectionScreen: React.FC = () => {
  const { decks, setDecks, selectedDeck, setSelectedDeck, setCards } =
    useGameStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setIsLoading(true);
      const decksData = await database.getMazos();
      console.log("Loaded decks:", decksData);
      setDecks(decksData);
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

  const getDeckColor = (index: number) => {
    const colorOptions = [
      colors.surfaceContainerHigh,
      colors.surfaceContainer,
      colors.surfaceContainerLowest,
      colors.surfaceContainerHigh,
      colors.surfaceContainer,
      colors.surfaceContainerLowest,
    ];
    return colorOptions[index % colorOptions.length];
  };

  const getCardCount = async (deckId: number) => {
    try {
      const cards = await database.getCartasByMazo(deckId);
      return cards.length;
    } catch {
      return 0;
    }
  };

  return (
    <CustomScreen contentStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          iconColor={colors.text}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>MAZOS</Text>
        <IconButton
          icon="refresh"
          size={24}
          iconColor={colors.text}
          onPress={loadDecks}
        />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.decksGrid}>
            {decks.map((deck, index) => {
              const deckColor = getDeckColor(index);
              const isSelected = selectedDeck?.id === deck.id;

              return (
                <TouchableOpacity
                  key={deck.id}
                  style={[
                    styles.deckCard,
                    { backgroundColor: deckColor },
                    isSelected && styles.selectedDeckCard,
                  ]}
                  onPress={() => handleSelectDeck(deck)}
                  activeOpacity={0.8}
                >
                  <View style={styles.deckCardContent}>
                    {/* Deck title */}
                    <Text style={styles.deckTitle} numberOfLines={2}>
                      {deck.nombre.toUpperCase()}
                    </Text>

                    {/* Selection indicator */}
                    {isSelected && (
                      <View style={styles.selectionIndicator}>
                        <View style={styles.checkCircle}>
                          <IconButton
                            icon="check"
                            size={20}
                            iconColor={colors.text}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

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
      </SafeAreaView>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
  },
  header: {
    paddingBottom: 5,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "800",
    fontFamily: typography.families.heading,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  decksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: spacing.lg,
  },
  deckCard: {
    width: cardWidth,
    height: 120,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    elevation: 4,
    position: "relative",
  },
  selectedDeckCard: {
    backgroundColor: colors.tertiaryContainer,
    elevation: 8,
  },
  deckCardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  deckTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "700",
    fontFamily: typography.families.bodyBold,
    color: colors.text,
    textAlign: "center",
    lineHeight: 20,
  },
  selectionIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  checkCircle: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
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
