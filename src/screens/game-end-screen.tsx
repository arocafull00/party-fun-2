import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  List,
  Surface,
  Chip
} from 'react-native-paper';
import { router } from 'expo-router';

import { useGameStore } from '../store/game-store';
import { database } from '../database/database';
import { borderRadius, colors, spacing, typography } from '../theme/theme';
import { CustomScreen } from '../shared/components/CustomScreen';

import { AppHeader } from '../shared/components/app-header';



const GameEndScreen: React.FC = () => {
  const {
    teams,
    selectedDeck,
    gameHistory,
    resetGame
  } = useGameStore();

  const [saving, setSaving] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);

  // Calculate winner and game stats
  const blueScore = teams.azul.score;
  const redScore = teams.rojo.score;
  const winner = blueScore > redScore ? 'azul' : redScore > blueScore ? 'rojo' : 'empate';
  const totalCards = gameHistory.reduce((total, round) => {
    return total + round.correctCards.length + round.incorrectCards.length;
  }, 0);
  const totalCorrect = gameHistory.reduce((total, round) => {
    return total + round.correctCards.length;
  }, 0);
  const accuracy = totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0;

  useEffect(() => {
    saveGameToDatabase();
  }, []);

  const saveGameToDatabase = async () => {
    if (gameSaved || saving) return;

    setSaving(true);
    try {
      // Create game record
      const gameData = {
        fecha: new Date().toISOString(),
        mazoId: selectedDeck?.id || 0,
        equipoGanador: winner === 'empate' ? null : (winner as 'azul' | 'rojo'),
        puntuacionAzul: blueScore,
        puntuacionRojo: redScore,
        totalCartas: totalCards,
        cartasCorrectas: totalCorrect,
        precision: accuracy
      };

      const gameId = await database.createPartida(gameData);

      // Save players
      const allPlayers = [...teams.azul.players, ...teams.rojo.players];
      for (const player of allPlayers) {
        const equipo: 'azul' | 'rojo' = teams.azul.players.includes(player) ? 'azul' : 'rojo';
        const playerData = {
          nombre: player.name,
          equipo
        };

        const playerId = await database.createJugador(playerData);
        await database.addPlayerToGame(gameId, playerId, equipo as 'azul' | 'rojo');
      }

      setGameSaved(true);
      console.log('Game saved successfully with ID:', gameId);
    } catch (error) {
      console.error('Error saving game:', error);
      // Don't show error to user, game can still be played
    } finally {
      setSaving(false);
    }
  };

  const handleNewGame = () => {
    resetGame();
    router.push('/new-game');
  };

  const handleBackToHome = () => {
    resetGame();
    router.push('/');
  };

  const handleViewStatistics = () => {
    router.push('/statistics');
  };

  const getWinnerColor = () => {
    if (winner === 'azul') return colors.primary;
    if (winner === 'rojo') return colors.secondary;
    return colors.text;
  };

  const getWinnerText = () => {
    if (winner === 'azul') return '¡EQUIPO AZUL GANA!';
    if (winner === 'rojo') return '¡EQUIPO ROJO GANA!';
    return '¡EMPATE!';
  };

  const getWinnerIcon = () => {
    if (winner === 'empate') return '🤝';
    return '🏆';
  };

  return (
    <CustomScreen contentStyle={styles.container} header={<AppHeader />}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Winner Announcement */}
        <Surface style={[styles.winnerContainer, { backgroundColor: getWinnerColor() }]} elevation={4}>
          <Text style={styles.winnerIcon}>{getWinnerIcon()}</Text>
          <Text style={styles.winnerText}>
            {getWinnerText()}
          </Text>
          {winner !== 'empate' && (
            <Text style={styles.winnerSubtext}>
              ¡Felicitaciones por la victoria!
            </Text>
          )}
        </Surface>

        {/* Final Scores */}
        <Card style={styles.scoresCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Puntuación Final</Text>

            <View style={styles.scoreRow}>
              <View style={[styles.teamScore, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.teamName, { color: colors.primary }]}>AZUL</Text>
                <Text style={[styles.teamScoreText, { color: colors.primary }]}>{blueScore}</Text>
                <Text style={styles.teamPlayersText}>
                  {teams.azul.players.map(p => p.name).join(', ')}
                </Text>
              </View>

              <Text style={styles.vs}>VS</Text>

              <View style={[styles.teamScore, { backgroundColor: colors.secondary + '20' }]}>
                <Text style={[styles.teamName, { color: colors.secondary }]}>ROJO</Text>
                <Text style={[styles.teamScoreText, { color: colors.secondary }]}>{redScore}</Text>
                <Text style={styles.teamPlayersText}>
                  {teams.rojo.players.map(p => p.name).join(', ')}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Game Statistics */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Estadísticas del Juego</Text>

            <List.Item
              title="Mazo utilizado"
              description={selectedDeck?.nombre || 'Sin mazo'}
              left={props => <List.Icon {...props} icon="cards" color={colors.primary} />}
            />

            <List.Item
              title="Total de cartas"
              description={`${totalCards} cartas jugadas`}
              left={props => <List.Icon {...props} icon="format-list-numbered" color={colors.primary} />}
            />

            <List.Item
              title="Cartas correctas"
              description={`${totalCorrect} aciertos`}
              left={props => <List.Icon {...props} icon="check-circle" color={colors.primary} />}
            />

            <List.Item
              title="Precisión"
              description={`${accuracy}% de acierto`}
              left={props => <List.Icon {...props} icon="target" color={colors.primary} />}
            />

            <List.Item
              title="Rondas completadas"
              description="3 rondas (Libre, Una palabra, Mímica)"
              left={props => <List.Icon {...props} icon="numeric-3-circle" color={colors.primary} />}
            />
          </Card.Content>
        </Card>

        {/* Round by Round Results */}
        <Card style={styles.roundsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Resultados por Ronda</Text>

            {gameHistory.map((round, index) => (
              <View key={index} style={styles.roundResult}>
                <Text style={styles.roundTitle}>Ronda {index + 1}</Text>
                <Text style={styles.roundDescription}>
                  {index === 0 && 'Pistas libres (excepto sinónimos)'}
                  {index === 1 && 'Solo una palabra como pista'}
                  {index === 2 && 'Solo mímica'}
                </Text>

                <View style={styles.roundStats}>
                  <Chip
                    icon="check"
                    style={[styles.statChip, { backgroundColor: colors.primary + '20' }]}
                    textStyle={{ color: colors.primary }}
                  >
                    {round.correctCards.length} correctas
                  </Chip>
                  <Chip
                    icon="close"
                    style={[styles.statChip, { backgroundColor: colors.accent + '20' }]}
                    textStyle={{ color: colors.accent }}
                  >
                    {round.incorrectCards.length} incorrectas
                  </Chip>
                </View>

                {index < gameHistory.length - 1 && <View style={styles.roundSpacer} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <View style={styles.actionsContainer}>
          <Button mode="contained" onPress={handleNewGame} icon="play">
            Nueva partida
          </Button>

          <Button mode="contained-tonal" onPress={handleViewStatistics} icon="chart-line">
            Ver Estadísticas
          </Button>

          <Button mode="contained-tonal" onPress={handleBackToHome} icon="home">
            Volver al Inicio
          </Button>
        </View>

        {/* Save Status */}
        {gameSaved && (
          <View style={styles.saveStatus}>
            <Chip
              icon="check-circle"
              style={styles.savedChip}
              textStyle={{ color: colors.primary }}
            >
              Partida guardada
            </Chip>
          </View>
        )}
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
    paddingTop: spacing.lg,
  },
  winnerContainer: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  winnerIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  winnerText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: '800',
    fontFamily: typography.families.heading,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  winnerSubtext: {
    fontSize: typography.sizes.md,
    color: '#ffffff',
    textAlign: 'center',
  },
  scoresCard: {
    marginBottom: spacing.lg,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '800',
    fontFamily: typography.families.heading,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamScore: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  teamName: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    marginBottom: 10,
  },
  teamScoreText: {
    fontSize: typography.sizes.display,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  teamPlayersText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  vs: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: spacing.md,
  },
  statsCard: {
    marginBottom: spacing.lg,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  roundsCard: {
    marginBottom: spacing.lg,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  roundResult: {
    marginBottom: spacing.md,
  },
  roundTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },
  roundDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  roundStats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statChip: {
    alignSelf: 'flex-start',
  },
  roundSpacer: {
    height: spacing.sm,
  },
  actionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    borderRadius: borderRadius.xl,
  },
  secondaryButton: {
    borderColor: colors.secondary,
    borderWidth: 0,
    backgroundColor: colors.background,
  },
  textButton: {
    // No specific styles needed
  },
  buttonContent: {
    minHeight: 50,
  },
  saveStatus: {
    alignItems: 'center',
    marginBottom: 20,
  },
  savedChip: {
    backgroundColor: colors.primary + '20',
  },
});

export default GameEndScreen; 