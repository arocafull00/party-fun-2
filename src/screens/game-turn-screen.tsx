import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert, BackHandler } from "react-native";
import {
  Text,
  Button,
  Card,
  IconButton,
  Dialog,
  Portal,
  Surface,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { useGameStore } from "../store/game-store";
import { colors } from "../theme/theme";

type RootStackParamList = {
  Home: undefined;
  NewGame: undefined;
  GameTurn: undefined;
  RoundResult: undefined;
  GameEnd: undefined;
};

type GameTurnScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GameTurn"
>;

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
    roundWords,
    startTimer,
    stopTimer,
    resetTimer,
    markWordCorrect,
    markWordIncorrect,
    nextTurn,
    endRound,
    endGame,
    gameStarted,
  } = useGameStore();

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [gamePhase, setGamePhase] = useState<"preparation" | "playing">(
    "preparation"
  );

  // Current player and team info
  const currentTeamData = teams[currentTeam];
  const currentPlayer = currentTeamData.players[currentPlayerIndex];
  const currentWord = roundWords[currentWordIndex];
  const wordsRemaining = roundWords.length - currentWordIndex;

  // Round descriptions
  const getRoundDescription = (round: number): string => {
    switch (round) {
      case 1:
        return "COGE EL MÓVIL";
      case 2:
        return "UNA PALABRA";
      case 3:
        return "MÍMICA";
      default:
        return "RONDA " + round;
    }
  };

  const getRoundInstructions = (round: number): string => {
    switch (round) {
      case 1:
        return "Puedes dar cualquier pista excepto sinónimos de la palabra.";
      case 2:
        return "Solo puedes decir UNA palabra como pista.";
      case 3:
        return "Solo puedes usar mímica, sin hablar.";
      default:
        return "";
    }
  };

  // Prevent back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowExitDialog(true);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

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
      return;
    }
  }, [gameStarted, navigation]);

  // Reset game phase when turn changes
  useEffect(() => {
    setGamePhase("preparation");
  }, [currentTeam, currentPlayerIndex]);

  const handleTimeUp = () => {
    stopTimer();
    setGamePhase("preparation");

    Alert.alert("¡Tiempo!", `Se acabó el tiempo para ${currentPlayer?.name}`, [
      {
        text: "Continuar",
        onPress: handleEndTurn,
      },
    ]);
  };

  const handleStartTurn = () => {
    setGamePhase("playing");
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
    setGamePhase("preparation");

    Alert.alert(
      "¡Todas las palabras completadas!",
      "Se han completado todas las palabras de esta ronda.",
      [
        {
          text: "Finalizar Ronda",
          onPress: () => {
            endRound();
            navigation.navigate("RoundResult");
          },
        },
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
        navigation.navigate("GameEnd");
      } else {
        // Go to round results
        navigation.navigate("RoundResult");
      }
    } else {
      // Continue with next turn - phase will reset due to useEffect
      setGamePhase("preparation");
    }
  };

  const handleExitGame = () => {
    setShowExitDialog(false);
    navigation.navigate("Home");
  };

  const formatTime = (seconds: number): string => {
    return seconds.toString().padStart(2, "0");
  };

  if (!gameStarted || !currentPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: Juego no iniciado</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("NewGame")}
            style={styles.button}
          >
            Volver a Nueva Partida
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Preparation Phase - Show player info and start button
  if (gamePhase === "preparation") {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header with exit button */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.roundText}>Ronda {currentRound}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.wordsRemainingNumber}>x{wordsRemaining}</Text>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.preparationContent}>
          {/* Team name */}
          <Surface
            style={[
              styles.teamBanner,
              {
                backgroundColor:
                  currentTeam === "azul" ? colors.teamBlue : colors.teamRed,
              },
            ]}
          >
            <Text style={styles.teamBannerText}>
              EQUIPO {currentTeam.toUpperCase()}
            </Text>
          </Surface>

          {/* Round description */}
          <Text style={styles.roundDescription}>
            TURNO {currentPlayerIndex + 1} - {getRoundDescription(currentRound)}
          </Text>

          {/* Player name */}
          <Text style={styles.playerNameLarge}>{currentPlayer.name}</Text>

          {/* Start button */}
          <Button
            mode="contained"
            onPress={handleStartTurn}
            style={styles.startButton}
            contentStyle={styles.startButtonContent}
            labelStyle={styles.startButtonLabel}
          >
            ¡EMPEZAR!
          </Button>
        </View>

        {/* Exit Dialog */}
        <Portal>
          <Dialog
            visible={showExitDialog}
            onDismiss={() => setShowExitDialog(false)}
          >
            <Dialog.Title>Salir del Juego</Dialog.Title>
            <Dialog.Content>
              <Text>
                ¿Estás seguro de que quieres salir? Se perderá el progreso del
                juego.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowExitDialog(false)}>Cancelar</Button>
              <Button onPress={handleExitGame} textColor={colors.error}>
                Salir
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    );
  }

  // Playing Phase - Show word and action buttons
  return (
    <SafeAreaView style={styles.container}>
      {/* Timer at top */}
      <View style={styles.timerHeader}>
        <View style={styles.timerHeaderLeft}>
          <Text style={styles.teamNameSmall}>
            Equipo {currentTeam === "azul" ? "Azul" : "Rojo"}
          </Text>
          <Text style={styles.playerNameSmall}>{currentPlayer.name}</Text>
        </View>
        <View style={styles.timerCenter}>
          <Surface style={styles.timerCircle} elevation={4}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </Surface>
        </View>
        <View style={styles.timerHeaderRight}>
          <Text style={styles.teamNameSmall}>Restantes</Text>
          <Text style={styles.wordsRemainingNumberSmall}>{wordsRemaining}</Text>
        </View>
      </View>

      {/* Main game area with buttons on sides */}
      <View style={styles.gameContent}>
        <View style={styles.gameRow}>
          {/* Left button */}
          <Surface style={styles.incorrectButton} elevation={4}>
            <IconButton
              icon="close"
              iconColor={colors.textLight}
              size={60}
              onPress={handleIncorrect}
            />
          </Surface>

          {/* Word card */}
          <Card style={styles.wordCard}>
            <Card.Content style={styles.wordCardContent}>
              <Text style={styles.wordText}>{currentWord}</Text>
            </Card.Content>
          </Card>

          {/* Right button */}
          <Surface style={styles.correctButton} elevation={4}>
            <IconButton
              icon="check"
              iconColor={colors.textLight}
              size={60}
              onPress={handleCorrect}
            />
          </Surface>
        </View>

        <Text style={styles.gameInstruction}>¡UNA PALABRA!</Text>
      </View>

      {/* Exit Dialog */}
      <Portal>
        <Dialog
          visible={showExitDialog}
          onDismiss={() => setShowExitDialog(false)}
        >
          <Dialog.Title>Salir del Juego</Dialog.Title>
          <Dialog.Content>
            <Text>
              ¿Estás seguro de que quieres salir? Se perderá el progreso del
              juego.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExitDialog(false)}>Cancelar</Button>
            <Button onPress={handleExitGame} textColor={colors.error}>
              Salir
            </Button>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    alignItems: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  roundText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
  },
  wordsRemainingText: {
    fontSize: 14,
    color: colors.text,
  },
  wordsRemainingNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
  },
  preparationContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  teamBanner: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
  },
  teamBannerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
  roundDescription: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  playerNameLarge: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 40,
    textTransform: "uppercase",
  },
  preparationInstructions: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  preparationSubtext: {
    fontSize: 16,
    color: colors.text + "80",
    textAlign: "center",
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    minWidth: 280,
    marginHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonContent: {
    height: 70,
    paddingHorizontal: 30,
  },
  startButtonLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Playing phase styles
  timerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
    position: "relative",
  },
  timerHeaderLeft: {
    position: "absolute",
    left: 20,
    alignItems: "flex-start",
  },
  teamNameSmall: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },
  playerNameSmall: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textLight,
  },
  timerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  timerHeaderRight: {
    position: "absolute",
    right: 20,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  wordsRemainingSmall: {
    fontSize: 14,
    color: colors.text,
  },
  wordsRemainingNumberSmall: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textLight,
  },
  gameContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
    height: "100%",
    paddingVertical: 40,
  },
  wordCard: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    elevation: 8,
    borderRadius: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  wordCardContent: {
    padding: 40,
    alignItems: "center",
  },
  wordLabel: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    position: "absolute",
  },
  wordText: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginVertical: 20,
  },
  gameInstruction: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  incorrectButton: {
    backgroundColor: colors.error,
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  correctButton: {
    backgroundColor: colors.success,
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
  },
});

export default GameTurnScreen;
