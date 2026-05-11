import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, List, Chip } from 'react-native-paper';
import { router } from 'expo-router';

import { useGameStore } from '../store/game-store';
import { borderRadius, colors, spacing, typography } from '../theme/theme';
import { CustomScreen } from '../shared/components/CustomScreen';
import { BouncyButton } from '../shared/components/BouncyButton';
import { AppHeader } from '../shared/components/app-header';

const RoundResultScreen: React.FC = () => {
  const { currentPhase, teams, gameHistory, currentTurnCards } = useGameStore();

  const handleNextRound = () => {
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

  const phaseHistory = gameHistory.filter((h) => h.roundNumber === currentPhase);
  const totalCorrect = phaseHistory.reduce((sum, h) => sum + h.correctCards.length, 0);
  const totalIncorrect = phaseHistory.reduce((sum, h) => sum + h.incorrectCards.length, 0);

  return (
    <CustomScreen
      contentStyle={styles.container}
      header={
        <AppHeader
          title={getRoundTitle(currentPhase)}
          subtitle="¡Ronda completada!"
        />
      }
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.scoresCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Puntuación de la Ronda</Text>
            <View style={styles.scoresContainer}>
              <View style={styles.scoreItem}>
                <Text style={[styles.teamName, { color: colors.primary }]}>
                  EQUIPO AZUL
                </Text>
                <Text style={[styles.scoreText, { color: colors.primary }]}>
                  {teams.azul.score}
                </Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.scoreItem}>
                <Text style={[styles.teamName, { color: colors.secondary }]}>
                  EQUIPO ROJO
                </Text>
                <Text style={[styles.scoreText, { color: colors.secondary }]}>
                  {teams.rojo.score}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.resultsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Resultados del Último Turno
          </Text>

          <View style={styles.teamsResultsRow}>
            <View style={styles.teamResults}>
              <CardsList
                cards={currentTurnCards.correct}
                title="Acertadas"
                color={colors.primary}
                correct={true}
              />
              <CardsList
                cards={currentTurnCards.incorrect}
                title="Falladas"
                color={colors.accent}
                correct={false}
              />
            </View>
          </View>
        </View>

        <Card style={styles.totalScoresCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Resumen de la Fase</Text>
            <View style={styles.totalScoresContainer}>
              <View style={styles.totalScoreItem}>
                <Chip
                  style={[
                    styles.totalScoreChip,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                  textStyle={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {totalCorrect} correctas
                </Chip>
              </View>
              <View style={styles.totalScoreItem}>
                <Chip
                  style={[
                    styles.totalScoreChip,
                    { backgroundColor: colors.accent + "20" },
                  ]}
                  textStyle={{
                    color: colors.accent,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {totalIncorrect} incorrectas
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

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
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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