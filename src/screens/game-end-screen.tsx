import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Divider,
  List,
  Surface,
  Chip
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useGameStore } from '../store/game-store';
import { database } from '../database/database';
import { colors } from '../theme/theme';
import { CustomScreen } from '../shared/components/CustomScreen';



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
        const equipo = teams.azul.players.includes(player) ? 'azul' : 'rojo';
        const playerData = {
          nombre: player.name,
          equipo: equipo
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
    if (winner === 'azul') return colors.primary + '20';
    if (winner === 'rojo') return colors.secondary + '20';
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
    <CustomScreen contentStyle={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Winner Announcement */}
        <Surface style={[styles.winnerContainer, { backgroundColor: getWinnerColor() }]} elevation={4}>
          <Text style={styles.winnerIcon}>{getWinnerIcon()}</Text>
          <Text style={[styles.winnerText, { color: getWinnerColor() }]}>
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
                
                {index < gameHistory.length - 1 && <Divider style={styles.roundDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={handleNewGame}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="play"
          >
            Nueva Partida
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleViewStatistics}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            icon="chart-line"
          >
            Ver Estadísticas
          </Button>
          
          <Button
            mode="text"
            onPress={handleBackToHome}
            style={styles.textButton}
            contentStyle={styles.buttonContent}
            icon="home"
          >
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
    paddingTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  winnerContainer: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  winnerIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  winnerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  winnerSubtext: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  scoresCard: {
    marginBottom: 20,
    backgroundColor: colors.background,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamScore: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  teamScoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
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
    marginHorizontal: 15,
  },
  statsCard: {
    marginBottom: 20,
    backgroundColor: colors.background,
    elevation: 4,
  },
  roundsCard: {
    marginBottom: 20,
    backgroundColor: colors.background,
    elevation: 4,
  },
  roundResult: {
    marginBottom: 15,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  roundDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  roundStats: {
    flexDirection: 'row',
    gap: 10,
  },
  statChip: {
    alignSelf: 'flex-start',
  },
  roundDivider: {
    backgroundColor: '#CCCCCC',
    marginTop: 15,
  },
  actionsContainer: {
    gap: 15,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  textButton: {
    // No specific styles needed
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
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