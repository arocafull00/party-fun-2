import React from "react";
import { View, FlatList } from "react-native";
import { Text, Button } from "react-native-paper";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGameStore } from "../store/game-store";
import { colors, spacing } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { DotsBackground } from "../shared/components/DotsBackground";
import {
  useCardReview,
  ReviewCard as ReviewCardType,
} from "./game/hooks/useCardReview";
import { WordReviewRow } from "./turn-review/components/word-review-row";
import { styles } from "./turn-review-screen.styles";

const TurnReviewScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    gameHistory,
    currentTurnCards,
    updateCurrentRoundCards,
    nextTurn,
    endTurn,
  } = useGameStore();

  const currentRound = gameHistory.length + 1;

  const { reviewCards, toggleCard, getCorrectCards, getIncorrectCards } =
    useCardReview(currentTurnCards.correct, currentTurnCards.incorrect);

  const handleNextTurn = () => {
    const updatedCorrect = getCorrectCards();
    const updatedIncorrect = getIncorrectCards();
    updateCurrentRoundCards(updatedCorrect, updatedIncorrect);

    const { phaseComplete, gameComplete } = endTurn();

    if (gameComplete) {
      router.push("/game-end");
      return;
    }

    if (phaseComplete) {
      router.push("/round-result");
      return;
    }

    const hasNextTurn = nextTurn();
    router.push(hasNextTurn ? "/game-turn" : "/game-turn");
  };

  const totalWords = reviewCards.length;

  const renderItem = ({
    item,
    index,
  }: {
    item: ReviewCardType;
    index: number;
  }) => (
    <WordReviewRow
      index={index}
      text={item.text}
      isCorrect={item.isCorrect}
      onToggle={() => toggleCard(index)}
    />
  );

  return (
    <CustomScreen contentStyle={styles.container}>
      <DotsBackground />
      <View
        style={[
          styles.content,
          {
            paddingLeft: spacing.lg + insets.left,
            paddingRight: spacing.lg + insets.right,
            paddingBottom: spacing.lg + insets.bottom,
          },
        ]}
      >
        {/* Header fijo */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>
            Ronda terminada
          </Text>
          <Text style={styles.headerSubtitle}>
            Revisa las palabras jugadas y marca aciertos o fallos
          </Text>
        </View>

        <View style={styles.roundSection}>
          <Text style={styles.roundTitle}>
            Ronda {currentRound}
          </Text>
          <View style={styles.roundBadge}>
            <Text style={styles.roundBadgeText}>
              {totalWords} palabras jugadas
            </Text>
          </View>
        </View>

        {/* Lista scrollable */}
        {reviewCards.length > 0 ? (
          <FlatList
            data={reviewCards}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.text}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            style={styles.listContainer}
          />
        ) : (
          <View style={styles.noCardsContainer}>
            <Text style={styles.noCardsText}>
              No hay cartas para revisar
            </Text>
          </View>
        )}

        {/* Botón fijo abajo */}
        {reviewCards.length > 0 && (
          <View style={styles.bottomSection}>
            <Button
              mode="contained"
              onPress={handleNextTurn}
              icon="arrow-right"
              buttonColor={colors.primary}
              textColor="#FFFFFF"
              style={styles.nextButton}
              contentStyle={styles.nextButtonContent}
              labelStyle={styles.nextButtonLabel}
            >
              Siguiente ronda
            </Button>
            <Text style={styles.nextButtonSubtitle}>
              Prepárate para la siguiente ronda
            </Text>
          </View>
        )}
      </View>
    </CustomScreen>
  );
};

export default TurnReviewScreen;
