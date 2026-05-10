import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  List,
  Chip
} from 'react-native-paper';
import { router } from 'expo-router';

import { useGameStore } from '../store/game-store';
import { borderRadius, colors, spacing, typography } from '../theme/theme';
import { CustomScreen } from '../shared/components/CustomScreen';
import { BouncyButton } from '../shared/components/BouncyButton';

const RoundResultScreen: React.FC = () => {
  const { currentPhase, teams, gameHistory, currentTurnCards, endGame, endRound } = useGameStore();

  // Get current round results
  const azulCorrect = currentTurnCards.correct.slice(0, Math.floor(currentTurnCards.correct.length / 2));
  const azulIncorrect = currentTurnCards.incorrect.slice(0, Math.floor(currentTurnCards.incorrect.length / 2));
  const rojoCorrect = currentTurnCards.correct.slice(Math.floor(currentTurnCards.correct.length / 2));
  const rojoIncorrect = currentTurnCards.incorrect.slice(Math.floor(currentTurnCards.incorrect.length / 2));

  const handleNextRound = () => {
    // The phase transition is already handled by endTurn() in turn-review-screen
    // We just need to continue to the next turn
    router.push('/game-turn');
  };

  const getRoundTitle = (round: number): string => {
    switch (round) {
      case 1: return 'Ronda 1 - Pista Libre';
      case 2: return 'Ronda 2 - Una Palabra';
      case 3: return 'Ronda 3 - Mímica';
      default: return `Ronda ${round}`;
    }
  };

  const CardsList: React.FC<{ 
    cards: string[], 
    title: string, 
    color: string,
    correct: boolean 
  }> = ({ cards, title, color, correct }) => (
    <Card style={styles.wordsCard}>
      <Card.Content>
        <View style={styles.wordsHeader}>
          <Text style={[styles.wordsTitle, { color }]}>{title}</Text>
          <Chip 
            icon={correct ? "check" : "close"}
            style={[styles.countChip, { backgroundColor: color }]}
            textStyle={{ color: colors.text }}
          >
            {cards.length}
          </Chip>
        </View>
        {cards.length === 0 ? (
          <Text style={styles.emptyText}>Sin cartas</Text>
        ) : (
          cards.map((card: string, index: number) => (
            <List.Item
              key={index}
              title={card}
              left={props => (
                <List.Icon 
                  {...props} 
                  icon={correct ? "check-circle" : "close-circle"}
                  color={color}
                />
              )}
              titleStyle={{ color: colors.text }}
            />
          ))
        )}
      </Card.Content>
    </Card>
  );

  return (
    <CustomScreen contentStyle={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Round Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Text style={styles.roundTitle}>
              {getRoundTitle(currentPhase)}
            </Text>
            <Text style={styles.completedText}>¡Ronda Completada!</Text>
          </Card.Content>
        </Card>

        {/* Scores */}
        <Card style={styles.scoresCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Puntuación de la Ronda</Text>
            <View style={styles.scoresContainer}>
              <View style={styles.scoreItem}>
                <Text style={[styles.teamName, { color: colors.primary }]}>
                  EQUIPO AZUL
                </Text>
                <Text style={[styles.scoreText, { color: colors.primary }]}>
                  {azulCorrect.length}
                </Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.scoreItem}>
                <Text style={[styles.teamName, { color: colors.secondary }]}>
                  EQUIPO ROJO
                </Text>
                <Text style={[styles.scoreText, { color: colors.secondary }]}>
                  {rojoCorrect.length}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Team Results */}
        <View style={styles.resultsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resultados por Equipo</Text>
          
          <View style={styles.teamsResultsRow}>
            {/* Blue Team */}
            <View style={styles.teamResults}>
              <CardsList 
                cards={azulCorrect}
                title="Equipo Azul - Acertadas"
                color={colors.primary}
                correct={true}
              />
              <CardsList 
                cards={azulIncorrect}
                title="Equipo Azul - Falladas"
                color={colors.accent}
                correct={false}
              />
            </View>

            {/* Red Team */}
            <View style={styles.teamResults}>
              <CardsList 
                cards={rojoCorrect}
                title="Equipo Rojo - Acertadas"
                color={colors.primary}
                correct={true}
              />
              <CardsList 
                cards={rojoIncorrect}
                title="Equipo Rojo - Falladas"
                color={colors.accent}
                correct={false}
              />
            </View>
          </View>
        </View>

        {/* Total Scores */}
        <Card style={styles.totalScoresCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Puntuación Total</Text>
            <View style={styles.totalScoresContainer}>
              <View style={styles.totalScoreItem}>
                <Chip 
                  style={[styles.totalScoreChip, { backgroundColor: colors.primary }]}
                  textStyle={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}
                >
                  Azul: {teams.azul.score}
                </Chip>
              </View>
              <View style={styles.totalScoreItem}>
                <Chip 
                  style={[styles.totalScoreChip, { backgroundColor: colors.secondary }]}
                  textStyle={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}
                >
                  Rojo: {teams.rojo.score}
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Continue Button */}
        <View style={styles.continueButton}>
          <BouncyButton
            label="Continuar"
            onPress={handleNextRound}
            icon="arrow-right"
          />
        </View>
      </ScrollView>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerCard: {
    backgroundColor: colors.background,
    marginBottom: spacing.md,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  roundTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '800',
    fontFamily: typography.families.heading,
    color: colors.text,
    textAlign: 'center',
  },
  completedText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  scoresCard: {
    backgroundColor: colors.background,
    marginBottom: spacing.md,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    fontFamily: typography.families.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scoreItem: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: '800',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  resultsContainer: {
    marginBottom: spacing.md,
  },
  teamsResultsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  teamResults: {
    flex: 1,
  },
  wordsCard: {
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
    elevation: 4,
  },
  wordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  wordsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  countChip: {
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
  },
  totalScoresCard: {
    backgroundColor: colors.background,
    marginBottom: spacing.md,
    elevation: 4,
  },
  totalScoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalScoreItem: {
    alignItems: 'center',
  },
  totalScoreChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  continueButton: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
  },
  continueButtonContent: {
    minHeight: 50,
  },
});

export default RoundResultScreen; 