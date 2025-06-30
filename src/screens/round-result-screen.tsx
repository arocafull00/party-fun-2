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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useGameStore } from '../store/game-store';
import { colors } from '../theme/theme';

type RootStackParamList = {
  RoundResult: undefined;
  GameTurn: undefined;
  GameEnd: undefined;
};

type RoundResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoundResult'>;

const RoundResultScreen: React.FC = () => {
  const navigation = useNavigation<RoundResultScreenNavigationProp>();
  const { currentRound, teams, gameHistory, currentRoundWords, endGame } = useGameStore();

  // Get current round results
  const azulCorrect = currentRoundWords.correct.slice(0, Math.floor(currentRoundWords.correct.length / 2));
  const azulIncorrect = currentRoundWords.incorrect.slice(0, Math.floor(currentRoundWords.incorrect.length / 2));
  const rojoCorrect = currentRoundWords.correct.slice(Math.floor(currentRoundWords.correct.length / 2));
  const rojoIncorrect = currentRoundWords.incorrect.slice(Math.floor(currentRoundWords.incorrect.length / 2));

  const handleNextRound = () => {
    if (currentRound >= 3) {
      endGame();
      navigation.navigate('GameEnd');
    } else {
      navigation.navigate('GameTurn');
    }
  };

  const getRoundTitle = (round: number): string => {
    switch (round) {
      case 1: return 'Ronda 1 - Pista Libre';
      case 2: return 'Ronda 2 - Una Palabra';
      case 3: return 'Ronda 3 - Mímica';
      default: return `Ronda ${round}`;
    }
  };

  const WordsList: React.FC<{ 
    words: string[], 
    title: string, 
    color: string,
    correct: boolean 
  }> = ({ words, title, color, correct }) => (
    <Card style={styles.wordsCard}>
      <Card.Content>
        <View style={styles.wordsHeader}>
          <Text style={[styles.wordsTitle, { color }]}>{title}</Text>
          <Chip 
            icon={correct ? "check" : "close"}
            style={[styles.countChip, { backgroundColor: color }]}
            textStyle={{ color: colors.textLight }}
          >
            {words.length}
          </Chip>
        </View>
        <Divider style={styles.divider} />
        {words.length === 0 ? (
          <Text style={styles.emptyText}>Sin palabras</Text>
        ) : (
          words.map((word: string, index: number) => (
            <List.Item
              key={index}
              title={word}
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Round Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Text style={styles.roundTitle}>
              {getRoundTitle(currentRound)}
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
                <Text style={[styles.teamName, { color: colors.teamBlue }]}>
                  EQUIPO AZUL
                </Text>
                <Text style={[styles.scoreText, { color: colors.teamBlue }]}>
                  {azulCorrect.length}
                </Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.scoreItem}>
                <Text style={[styles.teamName, { color: colors.teamRed }]}>
                  EQUIPO ROJO
                </Text>
                <Text style={[styles.scoreText, { color: colors.teamRed }]}>
                  {rojoCorrect.length}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Team Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Resultados por Equipo</Text>
          
          <View style={styles.teamsResultsRow}>
            {/* Blue Team */}
            <View style={styles.teamResults}>
              <WordsList 
                words={azulCorrect}
                title="Equipo Azul - Acertadas"
                color={colors.success}
                correct={true}
              />
              <WordsList 
                words={azulIncorrect}
                title="Equipo Azul - Falladas"
                color={colors.error}
                correct={false}
              />
            </View>

            {/* Red Team */}
            <View style={styles.teamResults}>
              <WordsList 
                words={rojoCorrect}
                title="Equipo Rojo - Acertadas"
                color={colors.success}
                correct={true}
              />
              <WordsList 
                words={rojoIncorrect}
                title="Equipo Rojo - Falladas"
                color={colors.error}
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
                  style={[styles.totalScoreChip, { backgroundColor: colors.teamBlue }]}
                  textStyle={{ color: colors.textLight, fontSize: 18, fontWeight: 'bold' }}
                >
                  Azul: {teams.azul.score}
                </Chip>
              </View>
              <View style={styles.totalScoreItem}>
                <Chip 
                  style={[styles.totalScoreChip, { backgroundColor: colors.teamRed }]}
                  textStyle={{ color: colors.textLight, fontSize: 18, fontWeight: 'bold' }}
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
          icon={currentRound >= 3 ? "trophy" : "arrow-right"}
        >
          {currentRound >= 3 ? 'VER RESULTADOS FINALES' : 'SIGUIENTE RONDA'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerCard: {
    backgroundColor: colors.surface,
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
    color: colors.success,
    textAlign: 'center',
    marginTop: 8,
  },
  scoresCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surface,
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
    color: colors.textLight,
  },
});

export default RoundResultScreen; 