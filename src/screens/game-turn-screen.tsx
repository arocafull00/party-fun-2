import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  ProgressBar,
  IconButton,
  Dialog,
  Portal,
  Surface
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useGameStore } from '../store/game-store';
import { colors } from '../theme/theme';

type RootStackParamList = {
  Home: undefined;
  NewGame: undefined;
  GameTurn: undefined;
  RoundResult: undefined;
  GameEnd: undefined;
};

type GameTurnScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameTurn'>;

const GameTurnScreen: React.FC = () => {
  const navigation = useNavigation<GameTurnScreenNavigationProp>();
  const {
    currentRound,
    currentTeam,
    currentPlayerIndex,
    teams,
    timer,
    isTimerRunning,
    currentWordIndex,
    words,
    roundWords,
    startTimer,
    stopTimer,
    resetTimer,
    markWordCorrect,
    markWordIncorrect,
    nextTurn,
    endRound,
    endGame,
    gameStarted
  } = useGameStore();

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [turnStarted, setTurnStarted] = useState(false);

  // Current player and team info
  const currentTeamData = teams[currentTeam];
  const currentPlayer = currentTeamData.players[currentPlayerIndex];
  const currentWord = roundWords[currentWordIndex];

  // Round descriptions
  const roundDescriptions: { [key: number]: string } = {
    1: 'RONDA 1: Pistas libres (excepto sinónimos)',
    2: 'RONDA 2: Solo una palabra como pista',
    3: 'RONDA 3: Solo mímica'
  };

  // Prevent back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowExitDialog(true);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        const newTime = useGameStore.getState().timer - 1;
        useGameStore.setState({ timer: newTime });
        
        if (newTime === 0) {
          handleTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timer]);

  // Check if game should redirect
  useEffect(() => {
    if (!gameStarted) {
      navigation.navigate('NewGame');
      return;
    }
  }, [gameStarted, navigation]);

  const handleTimeUp = () => {
    stopTimer();
    setTurnStarted(false);
    
    Alert.alert(
      '¡Tiempo!',
      `Se acabó el tiempo para ${currentPlayer?.name}`,
      [
        {
          text: 'Ver Resultados',
          onPress: handleEndTurn
        }
      ]
    );
  };

  const handleStartTurn = () => {
    setShowInstructions(false);
    setTurnStarted(true);
    startTimer();
  };

  const handleCorrect = () => {
    if (!currentWord) return;
    
    markWordCorrect(currentWord);
    
    // Check if all words are done
    if (currentWordIndex >= roundWords.length - 1) {
      handleAllWordsCompleted();
    } else {
      // Continue with next word
      useGameStore.setState({ currentWordIndex: currentWordIndex + 1 });
    }
  };

  const handleIncorrect = () => {
    if (!currentWord) return;
    
    markWordIncorrect(currentWord);
    
    // Check if all words are done
    if (currentWordIndex >= roundWords.length - 1) {
      handleAllWordsCompleted();
    } else {
      // Continue with next word
      useGameStore.setState({ currentWordIndex: currentWordIndex + 1 });
    }
  };

  const handleAllWordsCompleted = () => {
    stopTimer();
    setTurnStarted(false);
    
    Alert.alert(
      '¡Todas las palabras completadas!',
      'Se han completado todas las palabras de esta ronda.',
      [
        {
          text: 'Finalizar Ronda',
          onPress: () => {
            endRound();
            navigation.navigate('RoundResult');
          }
        }
      ]
    );
  };

  const handleEndTurn = () => {
    stopTimer();
    resetTimer();
    
    const isLastRound = currentRound === 3;
    const hasMoreTurns = nextTurn();
    
    if (!hasMoreTurns) {
      // End of round
      endRound();
      
      if (isLastRound) {
        // End of game
        endGame();
        navigation.navigate('GameEnd');
      } else {
        // Go to round results
        navigation.navigate('RoundResult');
      }
    } else {
      // Continue with next turn
      setShowInstructions(true);
      setTurnStarted(false);
    }
  };

  const handleExitGame = () => {
    setShowExitDialog(false);
    navigation.navigate('Home');
  };

  const formatTime = (seconds: number): string => {
    return seconds.toString().padStart(2, '0');
  };

  const getTimerColor = (): string => {
    if (timer <= 5) return colors.error;
    if (timer <= 10) return '#FF9800';
    return colors.success;
  };

  if (!gameStarted || !currentPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: Juego no iniciado</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('NewGame')}
            style={styles.button}
          >
            Volver a Nueva Partida
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.gameInfo}>
          <Text style={styles.roundText}>{roundDescriptions[currentRound]}</Text>
          <Text style={styles.scoreText}>
            Azul: {teams.azul.score} - Rojo: {teams.rojo.score}
          </Text>
        </View>
        <IconButton
          icon="close"
          iconColor={colors.error}
          size={24}
          onPress={() => setShowExitDialog(true)}
        />
      </View>

      {/* Timer and Player Info Row */}
      <View style={styles.topRow}>
        <Surface style={styles.timerContainer} elevation={4}>
          <Text style={[styles.timerText, { color: getTimerColor() }]}>
            {formatTime(timer)}
          </Text>
          <ProgressBar
            progress={timer / 30}
            color={getTimerColor()}
            style={styles.progressBar}
          />
        </Surface>

        <Card style={[styles.playerCard, { backgroundColor: currentTeam === 'azul' ? colors.teamBlue + '20' : colors.teamRed + '20' }]}>
          <Card.Content style={styles.playerCardContent}>
            <Text style={styles.playerLabel}>Turno de:</Text>
            <Text style={[styles.playerName, { color: currentTeam === 'azul' ? colors.teamBlue : colors.teamRed }]}>
              {currentPlayer.name}
            </Text>
            <Text style={[styles.teamName, { color: currentTeam === 'azul' ? colors.teamBlue : colors.teamRed }]}>
              EQUIPO {currentTeam.toUpperCase()}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Main Game Area */}
      <View style={styles.gameArea}>
        {/* Instructions or Word */}
        {showInstructions ? (
          <Card style={styles.instructionsCard}>
            <Card.Content>
              <Text style={styles.instructionsTitle}>¡Prepárate!</Text>
              <Text style={styles.instructionsText}>
                {currentRound === 1 && 'Puedes dar cualquier pista excepto sinónimos de la palabra.'}
                {currentRound === 2 && 'Solo puedes decir UNA palabra como pista.'}
                {currentRound === 3 && 'Solo puedes usar mímica, sin hablar.'}
              </Text>
              <Text style={styles.wordsRemaining}>
                Palabras restantes: {roundWords.length - currentWordIndex}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.wordCard}>
            <Card.Content style={styles.wordCardContent}>
              <Text style={styles.wordLabel}>Palabra:</Text>
              <Text style={styles.wordText}>{currentWord}</Text>
              <Text style={styles.wordCounter}>
                {currentWordIndex + 1} de {roundWords.length}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!turnStarted ? (
            <Button
              mode="contained"
              onPress={handleStartTurn}
              style={styles.startTurnButton}
              contentStyle={styles.startTurnButtonContent}
              labelStyle={styles.startTurnButtonLabel}
              icon="play"
            >
              ¡EMPEZAR TURNO!
            </Button>
          ) : (
            <View style={styles.gameButtons}>
              <Button
                mode="contained"
                onPress={handleCorrect}
                style={[styles.gameButton, styles.correctButton]}
                contentStyle={styles.gameButtonContent}
                labelStyle={styles.gameButtonLabel}
                icon="check"
                disabled={!isTimerRunning}
              >
                ¡CORRECTO!
              </Button>
              
              <Button
                mode="contained"
                onPress={handleIncorrect}
                style={[styles.gameButton, styles.incorrectButton]}
                contentStyle={styles.gameButtonContent}
                labelStyle={styles.gameButtonLabel}
                icon="close"
                disabled={!isTimerRunning}
              >
                INCORRECTO
              </Button>
            </View>
          )}

          {turnStarted && (
            <Button
              mode="outlined"
              onPress={handleEndTurn}
              style={styles.endTurnButton}
              contentStyle={styles.endTurnButtonContent}
              disabled={isTimerRunning}
            >
              Finalizar Turno
            </Button>
          )}
        </View>
      </View>

      {/* Exit Dialog */}
      <Portal>
        <Dialog visible={showExitDialog} onDismiss={() => setShowExitDialog(false)}>
          <Dialog.Title>Salir del Juego</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que quieres salir? Se perderá el progreso del juego.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExitDialog(false)}>Cancelar</Button>
            <Button onPress={handleExitGame} textColor={colors.error}>Salir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  gameInfo: {
    flex: 1,
  },
  roundText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  scoreText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 15,
  },
  timerContainer: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  playerCard: {
    flex: 1,
    elevation: 4,
  },
  playerCardContent: {
    padding: 20,
  },
  playerLabel: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionsCard: {
    margin: 15,
    backgroundColor: colors.surface,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  wordsRemaining: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  wordCard: {
    margin: 15,
    backgroundColor: colors.primary + '10',
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  wordCardContent: {
    padding: 20,
  },
  wordLabel: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  wordText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 15,
  },
  wordCounter: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  actionsContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  startTurnButton: {
    backgroundColor: colors.success,
    marginBottom: 20,
  },
  startTurnButtonContent: {
    height: 60,
  },
  startTurnButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  gameButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  gameButton: {
    flex: 1,
  },
  gameButtonContent: {
    height: 60,
  },
  gameButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  correctButton: {
    backgroundColor: colors.success,
  },
  incorrectButton: {
    backgroundColor: colors.error,
  },
  endTurnButton: {
    borderColor: colors.text,
  },
  endTurnButtonContent: {
    height: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
  },
});

export default GameTurnScreen; 