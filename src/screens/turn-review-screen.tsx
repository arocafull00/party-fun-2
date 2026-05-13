import React from "react";
import { View, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
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
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const headerTitle =
    reason === "out-of-cards"
      ? "No quedan más palabras!"
      : "Se acabó el tiempo!";
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

  return (
    <CustomScreen contentStyle={styles.container}>
      <DotsBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: spacing.md + insets.left,
            paddingRight: spacing.md + insets.right,
            paddingBottom: spacing.lg + insets.bottom,
          },
        ]}
        style={[
          styles.content,
          {
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
          },
        ]}
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <Text style={styles.headerSubtitle}>
            Revisa las palabras jugadas y marca aciertos o fallos
          </Text>
        </View>

        <View style={styles.roundSection}>
          <View style={styles.roundBadge}>
            <Text style={styles.roundBadgeText}>
              {totalWords} palabras jugadas
            </Text>
          </View>
        </View>

        {reviewCards.length > 0 ? (
          <View style={styles.listContainer}>
            {reviewCards.map((item: ReviewCardType, index: number) => (
              <WordReviewRow
                key={`${item.text}-${index}`}
                index={index}
                text={item.text}
                isCorrect={item.isCorrect}
                onToggle={() => toggleCard(index)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.noCardsContainer}>
            <Text style={styles.noCardsText}>
              No hay cartas para revisar
            </Text>
          </View>
        )}

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
      </ScrollView>
    </CustomScreen>
  );
};

export default TurnReviewScreen;
