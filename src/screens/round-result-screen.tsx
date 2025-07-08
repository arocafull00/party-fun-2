import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  List,
  Divider,
  Chip
} from 'react-native-paper';
import { router } from 'expo-router';

import { useGameStore } from '../store/game-store';
import { colors } from '../theme/theme';
import { CustomScreen } from '../shared/components/CustomScreen';

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
        <Divider style={styles.divider} />
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
        <Button
          mode="contained"
          onPress={handleNextRound}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          labelStyle={styles.continueButtonLabel}
          icon="arrow-right"
        >
          CONTINUAR
        </Button>
      </ScrollView>
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
  headerCard: {
    backgroundColor: colors.background,
    marginBottom: 15,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  completedText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  scoresCard: {
    backgroundColor: colors.background,
    marginBottom: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
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
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  resultsContainer: {
    marginBottom: 15,
  },
  teamsResultsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  teamResults: {
    flex: 1,
  },
  wordsCard: {
    backgroundColor: colors.background,
    marginBottom: 8,
    elevation: 4,
  },
  wordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  countChip: {
    elevation: 2,
  },
  divider: {
    backgroundColor: '#CCCCCC',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  totalScoresCard: {
    backgroundColor: colors.background,
    marginBottom: 15,
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
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  continueButton: {
    backgroundColor: colors.primary,
    marginBottom: 15,
  },
  continueButtonContent: {
    height: 50,
  },
  continueButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default RoundResultScreen; 