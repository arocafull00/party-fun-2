import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { router } from "expo-router";

import { useGameStore } from "../store/game-store";
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { BouncyButton } from "../shared/components/BouncyButton";
import { AppHeader } from "../shared/components/app-header";
import { AppHeaderIconButton } from "../shared/components/app-header-icon-button";
import { ReviewCard, RoundStats, PlayerInfo } from "./game/components";
import {
  useCardReview,
  ReviewCard as ReviewCardType,
} from "./game/hooks/useCardReview";

const TurnReviewScreen: React.FC = () => {
  const {
    currentPhase,
    currentTurnCards,
    updateCurrentRoundCards,
    getCurrentPlayer,
    getNextPlayer,
    nextTurn,
    endTurn,
    endGame,
  } = useGameStore();

  const currentPlayer = getCurrentPlayer();
  const nextPlayer = getNextPlayer();

  const { reviewCards, toggleCard, getCorrectCards, getIncorrectCards } =
    useCardReview(currentTurnCards.correct, currentTurnCards.incorrect);
  const handleNextTurn = () => {
    // Update the store with the reviewed cards
    const updatedCorrect = getCorrectCards();
    const updatedIncorrect = getIncorrectCards();
    updateCurrentRoundCards(updatedCorrect, updatedIncorrect);

    // Process the end of this turn (handle cards and check for phase/game completion)
    const { phaseComplete, gameComplete } = endTurn();

    if (gameComplete) {
      // Game ended because all phases are complete
      router.push("/game-end");
      return;
    }

    if (phaseComplete) {
      // Phase completed, go to phase summary
      router.push("/round-result");
      return;
    }

    // Phase continues, try to move to next turn
    const hasNextTurn = nextTurn();

    if (hasNextTurn) {
      // There's another turn, go to game turn screen
      router.push("/game-turn");
    } else {
      // No more players available, but phase is not complete
      // This shouldn't happen with proper team setup, but handle gracefully
      router.push("/game-turn");
    }
  };

  const getPhaseTitle = (phase: number): string => {
    switch (phase) {
      case 1:
        return "FASE 1 - PISTA LIBRE";
      case 2:
        return "FASE 2 - UNA PALABRA";
      case 3:
        return "FASE 3 - MÍMICA";
      default:
        return `FASE ${phase}`;
    }
  };

  const correctCount = getCorrectCards().length;
  const incorrectCount = getIncorrectCards().length;

  const renderCard = ({
    item,
    index,
  }: {
    item: ReviewCardType;
    index: number;
  }) => (
    <ReviewCard
      text={item.text}
      isCorrect={item.isCorrect}
      onToggle={() => toggleCard(index)}
      horizontal={true}
    />
  );

  return (
    <CustomScreen
      contentStyle={styles.container}
      header={
        <AppHeader
          title={getPhaseTitle(currentPhase)}
          subtitle="REVISIÓN DE TURNO"
          left={
            <AppHeaderIconButton
              icon="chevron-left"
              onPress={() => router.back()}
            />
          }
          right={null}
        />
      }
    >
      <View style={styles.content}>
        <PlayerInfo
          currentPlayer={currentPlayer?.name || "Jugador Actual"}
          nextPlayer={nextPlayer?.name || "Siguiente Jugador"}
        />

        <View style={styles.mainContent}>
          {reviewCards.length > 0 ? (
            <FlatList
              data={reviewCards}
              renderItem={renderCard}
              keyExtractor={(item, index) => `${item.text}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
              ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
              snapToInterval={280}
              decelerationRate="fast"
              snapToAlignment="center"
              style={styles.flatListStyle}
            />
          ) : (
            <View style={styles.noCardsContainer}>
              <Text style={styles.noCardsText}>No hay cartas para revisar</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomRow}>
          <RoundStats
            correctCount={correctCount}
            incorrectCount={incorrectCount}
          />
          
          <BouncyButton
            label="Siguiente turno"
            onPress={handleNextTurn}
            variant="primary"
          />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    height: 220,
  },
  cardSeparator: {
    width: spacing.sm,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    paddingLeft: spacing.xl,
    marginTop: 'auto',
  },
  nextButton: {
    borderRadius: borderRadius.xl,
    minWidth: 180,
  },
  nextButtonContent: {
    minHeight: 50,
    justifyContent: "center",
  },
  flatListStyle: {
    height: 220,
    width: '100%',
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noCardsText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    textAlign: 'center',
  },
});

export default TurnReviewScreen;
