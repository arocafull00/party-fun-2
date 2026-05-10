import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert, BackHandler } from "react-native";
import {
  Text,
  Button,
  IconButton,
  Dialog,
  Portal,
  Icon,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import { useGameStore } from "../store/game-store";
import { borderRadius, colors, spacing, typography } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { BouncyButton } from "../shared/components/BouncyButton";

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

  const currentTeamData = teams[currentTeam];
  const currentPlayer = currentTeamData.players[currentPlayerIndex];
  const currentCard = phaseCards[currentCardIndex];
  const cardsRemaining = phaseCards.length - currentCardIndex;

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

  useEffect(() => {
    if (!gameStarted) {
      return;
    }
  }, [gameStarted]);

  useEffect(() => {
    setGamePhase("preparation");
  }, [currentTeam, currentPlayerIndex]);

  const prepDots = useMemo(() => {
    const rows = [8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92];
    const cols = [6, 16, 26, 36, 46, 56, 66, 76, 86, 96];
    return rows.flatMap((top) => cols.map((left) => ({ top, left })));
  }, []);

  const currentTeamScore = teams[currentTeam].score;
  const oppositeTeam = currentTeam === "azul" ? "rojo" : "azul";
  const oppositeTeamScore = teams[oppositeTeam].score;

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
    if (!currentCard) {
      return;
    }

    markCardCorrect(currentCard);

    if (currentCardIndex >= phaseCards.length - 1) {
      handleAllCardsCompleted();
      return;
    }

    useGameStore.setState({ currentCardIndex: currentCardIndex + 1 });
  };

  const handleIncorrect = () => {
    if (!currentCard) {
      return;
    }

    markCardIncorrect(currentCard);

    if (currentPhase === 1) {
      reduceTimerForSkip();
    }

    if (currentCardIndex >= phaseCards.length - 1) {
      handleAllCardsCompleted();
      return;
    }

    useGameStore.setState({ currentCardIndex: currentCardIndex + 1 });
  };

  const handleAllCardsCompleted = () => {
    stopTimer();
    setGamePhase("preparation");
    router.push("/turn-review");
  };

  const handleEndTurn = () => {
    stopTimer();
    resetTimer();
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

  if (gamePhase === "preparation") {
    return (
      <CustomScreen contentStyle={styles.screenContent}>
        <View style={styles.screen}>
          <View style={styles.prepBlueBackground} />
          {prepDots.map((dot, index) => (
            <View
              key={`prep-dot-${index}`}
              style={[styles.prepDot, { top: `${dot.top}%`, left: `${dot.left}%` }]}
            />
          ))}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <View style={styles.avatarPill}>
                <Icon source="account" size={18} color={colors.text} />
              </View>
              <Text style={styles.topBrand}>Party Fun 2</Text>
            </View>
            <IconButton
              icon="cog"
              size={24}
              iconColor={colors.text}
              style={styles.settingsButton}
              onPress={() => setShowExitDialog(true)}
            />
          </View>
          <View style={styles.prepContent}>
            <View
              style={[
                styles.prepTeamBadge,
                { backgroundColor: currentTeam === "azul" ? "#2f89e9" : "#d4513a" },
              ]}
            >
              <Text style={styles.prepTeamBadgeText}>EQUIPO {currentTeam.toUpperCase()}</Text>
            </View>
            <Text style={styles.prepTurnLine}>
              TURNO {currentPlayerIndex + 1} - {getPhaseDescription(currentPhase)}
            </Text>
            <View style={styles.prepPlayerCard}>
              <Text style={styles.prepPlayerName}>{currentPlayer.name}</Text>
            </View>
            <View style={styles.prepStatsRow}>
              <View style={styles.prepStatCard}>
                <Text style={styles.prepStatLabel}>RONDA</Text>
                <Text style={styles.prepStatValue}>{currentPhase}</Text>
              </View>
              <View style={styles.prepStatCard}>
                <Text style={styles.prepStatLabel}>RESTANTES</Text>
                <Text style={styles.prepStatValue}>x{cardsRemaining}</Text>
              </View>
            </View>
            <View style={styles.prepStartButton}>
              <BouncyButton
                label="¡Empezar!"
                onPress={handleStartTurn}
                variant="tertiary"
                icon="play"
              />
            </View>
          </View>
        </View>
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

  return (
    <CustomScreen contentStyle={styles.screenContent}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.avatarPill}>
              <Text style={styles.avatarInitial}>
                {currentPlayer.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.topBrand}>Party Fun 2</Text>
          </View>
          <IconButton
            icon="cog"
            size={24}
            iconColor={colors.text}
            style={styles.settingsButton}
            onPress={() => setShowExitDialog(true)}
          />
        </View>
        <View style={styles.playingScoreRow}>
          <View style={styles.scoreSideCard}>
            <Text style={styles.scoreSideLabel}>
              TEAM {currentTeam === "azul" ? "BLUE" : "RED"}
            </Text>
            <View
              style={[
                styles.scoreValueBox,
                { backgroundColor: currentTeam === "azul" ? "#5ca7ff" : "#ffb4a9" },
              ]}
            >
              <Text style={styles.scoreValueText}>{currentTeamScore}</Text>
            </View>
          </View>
          <View style={styles.mainTimerWrap}>
            <View style={styles.mainTimerCircle}>
              <Text style={styles.mainTimerText}>{formatTime(timer)}</Text>
            </View>
          </View>
          <View style={styles.scoreSideCard}>
            <Text style={styles.scoreSideLabel}>
              TEAM {oppositeTeam === "azul" ? "BLUE" : "RED"}
            </Text>
            <View
              style={[
                styles.scoreValueBox,
                { backgroundColor: oppositeTeam === "azul" ? "#5ca7ff" : "#ffb4a9" },
              ]}
            >
              <Text style={styles.scoreValueText}>{oppositeTeamScore}</Text>
            </View>
          </View>
        </View>
        <View style={styles.wordCard}>
          <View style={styles.wordMarkerTop}>
            <Text style={styles.wordMarkerText}>
              {currentPhase === 1 ? "P" : currentPhase === 2 ? "1" : "M"}
            </Text>
          </View>
          <Text style={styles.wordText}>{currentCard}</Text>
          <View style={styles.wordUnderline} />
          <View style={styles.wordMarkerBottom}>
            <Text style={styles.wordMarkerText}>F</Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <IconButton
            icon="close"
            size={56}
            iconColor={colors.textLight}
            style={styles.wrongButton}
            onPress={handleIncorrect}
          />
          <View style={styles.phaseHintPill}>
            <Text style={styles.phaseHintText}>
              {currentPhase === 1
                ? "PISTA LIBRE"
                : currentPhase === 2
                  ? "¡UNA PALABRA!"
                  : "MÍMICA"}
            </Text>
          </View>
          <IconButton
            icon="check"
            size={56}
            iconColor={colors.textLight}
            style={styles.correctButton}
            onPress={handleCorrect}
          />
        </View>
        <View style={styles.currentTurnBox}>
          <Text style={styles.currentTurnLabel}>CURRENT TURN</Text>
          <Text style={styles.currentTurnPlayer}>{currentPlayer.name}</Text>
        </View>
      </View>
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
  },
  screenContent: {
    paddingHorizontal: 0,
  },
  screen: {
    flex: 1,
    paddingTop: spacing.sm,
    position: "relative",
  },
  prepBlueBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
  },
  prepDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: "#2d6cb4",
    opacity: 0.7,
  },
  topBar: {
    backgroundColor: colors.surfaceContainerLowest,
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#e7dac8",
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarPill: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: "#6babff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: typography.families.heading,
    color: "#173a5b",
    fontSize: typography.sizes.lg,
  },
  topBrand: {
    fontFamily: typography.families.heading,
    color: colors.primary,
    fontSize: typography.sizes.xxxl,
  },
  settingsButton: {
    margin: 0,
  },
  prepContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  prepTeamBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  prepTeamBadgeText: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.heading,
    color: colors.textLight,
    letterSpacing: 1,
  },
  prepTurnLine: {
    fontSize: typography.sizes.xxxl,
    fontFamily: typography.families.bodyBold,
    color: "#83b4e6",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  prepPlayerCard: {
    width: "100%",
    minHeight: 170,
    borderRadius: borderRadius.xxl,
    borderWidth: 3,
    borderColor: "#6ea3df",
    backgroundColor: "rgba(11, 100, 187, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  prepPlayerName: {
    fontSize: 92,
    lineHeight: 92,
    fontFamily: typography.families.heading,
    color: "#f4d79e",
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: "#704f26",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
  prepStatsRow: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  prepStatCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: borderRadius.xl,
    backgroundColor: "#0f73cf",
    borderWidth: 1,
    borderColor: "#308ee6",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  prepStatLabel: {
    fontSize: typography.sizes.lg,
    color: "#8db9e7",
    fontFamily: typography.families.bodyBold,
    letterSpacing: 2,
  },
  prepStatValue: {
    fontSize: 58,
    lineHeight: 58,
    color: colors.textLight,
    fontFamily: typography.families.heading,
  },
  prepStartButton: {
    width: "100%",
    borderRadius: borderRadius.xl,
  },
  prepStartButtonContent: {
    minHeight: 86,
    paddingHorizontal: spacing.lg,
  },
  playingScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  scoreSideCard: {
    width: 94,
    alignItems: "center",
    gap: spacing.xs,
  },
  scoreSideLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: 12,
    color: "#9a7f65",
    letterSpacing: 1,
  },
  scoreValueBox: {
    minWidth: 88,
    minHeight: 72,
    borderRadius: borderRadius.lg,
    borderBottomWidth: 5,
    borderBottomColor: "#9a2a18",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  scoreValueText: {
    fontSize: typography.sizes.display,
    lineHeight: typography.sizes.display,
    fontFamily: typography.families.bodyBold,
    color: "#2d1d12",
  },
  mainTimerWrap: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    borderWidth: 9,
    borderColor: "#b32b12",
    alignItems: "center",
    justifyContent: "center",
  },
  mainTimerCircle: {
    width: 118,
    height: 118,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTimerText: {
    fontSize: 68,
    lineHeight: 68,
    fontFamily: typography.families.heading,
    color: "#2d1d12",
  },
  wordCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xxl,
    minHeight: 290,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
    borderBottomWidth: 7,
    borderBottomColor: "#ebdfcf",
  },
  wordMarkerTop: {
    position: "absolute",
    top: 20,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: "#fff0d8",
    alignItems: "center",
    justifyContent: "center",
  },
  wordText: {
    fontSize: 84,
    lineHeight: 84,
    fontFamily: typography.families.heading,
    color: "#0d0d15",
    textAlign: "center",
    textTransform: "uppercase",
  },
  wordUnderline: {
    width: 126,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: "#d8e8f8",
    marginTop: spacing.lg,
  },
  wordMarkerBottom: {
    position: "absolute",
    right: 24,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: "#fff0d8",
    alignItems: "center",
    justifyContent: "center",
  },
  wordMarkerText: {
    color: "#7a592f",
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xxxl,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  wrongButton: {
    width: 118,
    height: 118,
    borderRadius: borderRadius.full,
    backgroundColor: "#b31e03",
    margin: 0,
  },
  correctButton: {
    width: 118,
    height: 118,
    borderRadius: borderRadius.full,
    backgroundColor: "#3f6600",
    margin: 0,
  },
  phaseHintPill: {
    flex: 1,
    marginHorizontal: spacing.md,
    minHeight: 72,
    borderRadius: borderRadius.full,
    backgroundColor: "#c8ff7f",
    borderBottomWidth: 4,
    borderBottomColor: "#8fcc3d",
    alignItems: "center",
    justifyContent: "center",
  },
  phaseHintText: {
    fontFamily: typography.families.bodyBold,
    color: "#23340d",
    fontSize: typography.sizes.xl,
    letterSpacing: 1.1,
  },
  currentTurnBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  currentTurnLabel: {
    fontFamily: typography.families.bodyBold,
    color: "#7f663f",
    fontSize: typography.sizes.md,
    letterSpacing: 2,
  },
  currentTurnPlayer: {
    fontFamily: typography.families.heading,
    color: colors.primary,
    fontSize: 56,
    lineHeight: 56,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.error,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
  },
});

export default GameTurnScreen;
