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
import { router, useFocusEffect } from "expo-router";

import { useGameStore } from "../store/game-store";
import { colors } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";

const GameTurnScreen: React.FC = () => {
  const {
    currentPhase,
    currentTeam,
    currentPlayerIndex,
    teams,
    timer,
    isTimerRunning,
    currentCardIndex,
    phaseCards,
    startTimer,
    stopTimer,
    resetTimer,
    decrementTimer,
    reduceTimerForSkip,
    markCardCorrect,
    markCardIncorrect,
    gameStarted,
  } = useGameStore();

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [gamePhase, setGamePhase] = useState<"preparation" | "playing">(
    "preparation"
  );

  // Current player and team info
  const currentTeamData = teams[currentTeam];
  const currentPlayer = currentTeamData.players[currentPlayerIndex];
  const currentCard = phaseCards[currentCardIndex];
  const cardsRemaining = phaseCards.length - currentCardIndex;

  // Phase descriptions
  const getPhaseDescription = (phase: number): string => {
    switch (phase) {
      case 1:
        return "COGE EL MÓVIL";
      case 2:
        return "UNA PALABRA";
      case 3:
        return "MÍMICA";
      default:
        return "FASE " + phase;
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
    let interval: ReturnType<typeof setInterval>;

    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        const timerStillRunning = decrementTimer();

        if (!timerStillRunning) {
          handleTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timer, decrementTimer]);

  // Check if game should redirect
  useEffect(() => {
    if (!gameStarted) {
      return;
    }
  }, [gameStarted]);

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
    if (!currentCard) return;

    markCardCorrect(currentCard);

    // Check if all cards are done
    if (currentCardIndex >= phaseCards.length - 1) {
      handleAllCardsCompleted();
    } else {
      // Continue with next card
      useGameStore.setState({ currentCardIndex: currentCardIndex + 1 });
    }
  };

  const handleIncorrect = () => {
    if (!currentCard) return;

    markCardIncorrect(currentCard);

    // In phase 1, reduce timer by 5 seconds when skipping a word
    if (currentPhase === 1) {
      reduceTimerForSkip();
    }

    // Check if all cards are done
    if (currentCardIndex >= phaseCards.length - 1) {
      handleAllCardsCompleted();
    } else {
      // Continue with next card
      useGameStore.setState({ currentCardIndex: currentCardIndex + 1 });
    }
  };

  const handleAllCardsCompleted = () => {
    stopTimer();
    setGamePhase("preparation");
    router.push("/turn-review");
  };

  const handleEndTurn = () => {
    stopTimer();
    resetTimer();

    // Always go to turn review screen after a turn ends
    router.push("/turn-review");
  };

  const handleExitGame = () => {
    setShowExitDialog(false);
    router.push("/");
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
            onPress={() => router.push("/new-game")}
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
      <CustomScreen contentStyle={styles.container}>
        {/* Header with exit button */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.roundText}>Fase {currentPhase}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.wordsRemainingNumber}>x{cardsRemaining}</Text>
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
                  currentTeam === "azul" ? colors.primary : colors.secondary,
              },
            ]}
          >
            <Text style={styles.teamBannerText}>
              EQUIPO {currentTeam.toUpperCase()}
            </Text>
          </Surface>

          {/* Phase description */}
          <Text style={styles.roundDescription}>
            TURNO {currentPlayerIndex + 1} - {getPhaseDescription(currentPhase)}
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
            <Dialog.Title>Terminar Partida</Dialog.Title>
            <Dialog.Content>
              <Text>
                ¿Quieres terminar la partida? Se perderá todo el progreso del
                juego.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowExitDialog(false)}>Cancelar</Button>
              <Button onPress={handleExitGame} textColor={colors.accent}>
                Terminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </CustomScreen>
    );
  }

  // Playing Phase - Show word and action buttons
  return (
    <CustomScreen contentStyle={styles.container}>
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
          <Text style={styles.wordsRemainingNumberSmall}>{cardsRemaining}</Text>
        </View>
      </View>

      {/* Main game area with buttons on sides */}
      <View style={styles.gameContent}>
        <View style={styles.gameRow}>
          {/* Left button */}
          <Surface style={styles.incorrectButton} elevation={4}>
            <IconButton
              icon="close"
              iconColor={colors.text}
              size={60}
              onPress={handleIncorrect}
            />
          </Surface>

          {/* Word card */}
          <Card style={styles.wordCard}>
            <Card.Content style={styles.wordCardContent}>
              <Text style={styles.wordText}>{currentCard}</Text>
            </Card.Content>
          </Card>

          {/* Right button */}
          <Surface style={styles.correctButton} elevation={4}>
            <IconButton
              icon="check"
              iconColor={colors.text}
              size={60}
              onPress={handleCorrect}
            />
          </Surface>
        </View>
      </View>

      {/* Exit Dialog */}
      <Portal>
        <Dialog
          visible={showExitDialog}
          onDismiss={() => setShowExitDialog(false)}
        >
          <Dialog.Title>Terminar Partida</Dialog.Title>
          <Dialog.Content>
            <Text>
              ¿Quieres terminar la partida? Se perderá todo el progreso del
              juego.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExitDialog(false)}>Cancelar</Button>
            <Button onPress={handleExitGame} textColor={colors.accent}>
              Terminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    color: colors.text,
  },
  wordsRemainingText: {
    fontSize: 14,
    color: colors.text,
  },
  wordsRemainingNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
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
    color: colors.text,
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
    color: colors.text,
    fontWeight: "500",
  },
  playerNameSmall: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
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
    backgroundColor: colors.background,
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
    color: colors.text,
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.accent,
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  correctButton: {
    backgroundColor: colors.primary,
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
    color: colors.accent,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
  },
});

export default GameTurnScreen;
