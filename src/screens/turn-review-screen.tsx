import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Button } from "react-native-paper";
import { router } from "expo-router";

import { useGameStore } from "../store/game-store";
import { colors } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { ReviewCard, RoundStats, PlayerInfo } from "./game/components";
import {
  useCardReview,
  ReviewCard as ReviewCardType,
} from "./game/hooks/useCardReview";

const TurnReviewScreen: React.FC = () => {
  const {
    currentRound,
    currentRoundCards,
    updateCurrentRoundCards,
    getCurrentPlayer,
    getNextPlayer,
    nextTurn,
    endRound,
    endGame,
  } = useGameStore();

  const currentPlayer = getCurrentPlayer();
  const nextPlayer = getNextPlayer();

  const { reviewCards, toggleCard, getCorrectCards, getIncorrectCards } =
    useCardReview(currentRoundCards.correct, currentRoundCards.incorrect);
  console.log(reviewCards);
  const handleNextTurn = () => {
    // Update the store with the reviewed cards
    const updatedCorrect = getCorrectCards();
    const updatedIncorrect = getIncorrectCards();
    updateCurrentRoundCards(updatedCorrect, updatedIncorrect);

    // Move to next turn
    const hasNextTurn = nextTurn();

    if (hasNextTurn) {
      // There's another turn, go to game turn screen
      router.push("/game-turn");
    } else {
      // No more turns in this round, end the round
      endRound();

      if (currentRound >= 3) {
        // Game is over after round 3
        endGame();
        router.push("/game-end");
      } else {
        // Go to round summary
        router.push("/round-result");
      }
    }
  };

  const getRoundTitle = (round: number): string => {
    switch (round) {
      case 1:
        return "RONDA 1 - PISTA LIBRE";
      case 2:
        return "RONDA 2 - UNA PALABRA";
      case 3:
        return "RONDA 3 - MÍMICA";
      default:
        return `RONDA ${round}`;
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
    <CustomScreen contentStyle={styles.container}>
      <View style={styles.content}>
        {/* Header Row with PlayerInfo on the left */}
        <View style={styles.headerRow}>
          <View style={styles.playerInfoContainer}>
            <PlayerInfo
              currentPlayer={currentPlayer?.name || "Jugador Actual"}
              nextPlayer={nextPlayer?.name || "Siguiente Jugador"}
            />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{getRoundTitle(currentRound)}</Text>
            <Text style={styles.headerSubtitle}>REVISIÓN DE TURNO</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content - Horizontal Cards List */}
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

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <RoundStats
            correctCount={correctCount}
            incorrectCount={incorrectCount}
          />
          
          <Button
            mode="contained"
            onPress={handleNextTurn}
            style={styles.nextButton}
            contentStyle={styles.nextButtonContent}
            labelStyle={styles.nextButtonLabel}
          >
            SIGUIENTE TURNO
          </Button>
        </View>
      </View>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  playerInfoContainer: {
    flex: 1,
    paddingTop: 5,
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    height: 220,
  },
  cardSeparator: {
    width: 15,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingLeft: 25,
    marginTop: 'auto',
  },
  nextButton: {
    backgroundColor: colors.primary,
    height: 50,
    minWidth: 180,
  },
  nextButtonContent: {
    height: 50,
    justifyContent: "center",
  },
  nextButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
  },
  flatListStyle: {
    height: 220,
    width: '100%',
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCardsText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default TurnReviewScreen;
