import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Alert, BackHandler, ImageBackground } from "react-native";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import { useGameStore, TURN_TIME } from "../store/game-store";
import { TimerEngine } from "../engine/timer-engine";
import { colors } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { AppHeader } from "../shared/components/app-header";
import { AppHeaderIconButton } from "../shared/components/app-header-icon-button";
import { GameTurnPrepTeamPill } from "./game-turn/components/game-turn-prep-team-pill";
import { GameTurnPrepTurnHeading } from "./game-turn/components/game-turn-prep-turn-heading";
import { GameTurnPrepPlayerCard } from "./game-turn/components/game-turn-prep-player-card";
import { GameTurnPrepStatsRow } from "./game-turn/components/game-turn-prep-stats-row";
import { GameTurnPrepStartButton } from "./game-turn/components/game-turn-prep-start-button";
import { GameTurnPlayingActionRow } from "./game-turn/components/game-turn-playing-action-row";
import { GameTurnPlayingHeaderLeft } from "./game-turn/components/game-turn-playing-header-left";
import { GameTurnPlayingStatsRow } from "./game-turn/components/game-turn-playing-stats-row";
import { GameTurnPlayingWordCard } from "./game-turn/components/game-turn-playing-word-card";
import { styles } from "./game-turn-screen.styles";

const backgroundImage = require("../../assets/background.jpg");

const GameTurnScreen: React.FC = () => {
  const {
    currentPhase,
    currentTeam,
    currentPlayerIndex,
    teams,
    timer,
    currentCardIndex,
    phaseCards,
    currentTurnCards,
    setTimer,
    setIsTimerRunning,
    markCardCorrect,
    markCardIncorrect,
    nextCard,
    gameStarted,
  } = useGameStore();

  const [gamePhase, setGamePhase] = useState<"preparation" | "playing">(
    "preparation"
  );

  const timerEngineRef = useRef<TimerEngine | null>(null);

  const currentTeamData = teams[currentTeam];
  const currentPlayer = currentTeamData.players[currentPlayerIndex];
  const currentCard = phaseCards[currentCardIndex];
  console.log("currentCard", currentCard);
  console.log("currentCardIndex", currentCardIndex);
  console.log("phaseCards", phaseCards);
  const cardsRemaining = phaseCards.length - currentCardIndex;

  const handleExitGame = useCallback(() => {
    timerEngineRef.current?.stop();
    router.push("/");
  }, []);

  const confirmExitGame = useCallback(() => {
    Alert.alert(
      "Terminar Partida",
      "¿Quieres terminar la partida? Se perderá todo el progreso del juego.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Terminar", onPress: handleExitGame },
      ]
    );
  }, [handleExitGame]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        confirmExitGame();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [confirmExitGame])
  );

  useEffect(() => {
    setGamePhase("preparation");
  }, [currentTeam, currentPlayerIndex]);

  useEffect(() => {
    return () => {
      timerEngineRef.current?.stop();
    };
  }, []);

  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    setGamePhase("preparation");

    Alert.alert("¡Tiempo!", `Se acabó el tiempo para ${currentPlayer?.name}`, [
      {
        text: "Continuar",
        onPress: handleEndTurn,
      },
    ]);
  }, [currentPlayer?.name, setIsTimerRunning]);

  const handleStartTurn = () => {
    setGamePhase("playing");
    setIsTimerRunning(true);

    if (!timerEngineRef.current) {
      timerEngineRef.current = new TimerEngine(
        TURN_TIME,
        (remaining) => setTimer(remaining),
        handleTimeUp
      );
    } else {
      timerEngineRef.current.reset();
    }

    timerEngineRef.current.start();
  };

  const handleCorrect = () => {
    if (!currentCard) return;

    markCardCorrect(currentCard);

    if (currentCardIndex >= phaseCards.length - 1) {
      timerEngineRef.current?.stop();
      setIsTimerRunning(false);
      setGamePhase("preparation");
      router.push("/turn-review");
      return;
    }

    nextCard();
  };

  const handleIncorrect = () => {
    if (!currentCard) return;

    markCardIncorrect(currentCard);

    if (currentPhase === 1) {
      timerEngineRef.current?.reduceTime(5);
    }

    if (currentCardIndex >= phaseCards.length - 1) {
      timerEngineRef.current?.stop();
      setIsTimerRunning(false);
      setGamePhase("preparation");
      router.push("/turn-review");
      return;
    }

    nextCard();
  };

  const handleEndTurn = () => {
    timerEngineRef.current?.stop();
    setIsTimerRunning(false);
    setTimer(TURN_TIME);
    router.push("/turn-review");
  };

  if (!gameStarted || !currentPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: Juego no iniciado</Text>
          <Button
            mode="contained"
            onPress={() => router.push("/new-game")}
            style={styles.errorButton}
          >
            Volver a Nueva Partida
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (gamePhase === "preparation") {
    return (
      <CustomScreen
        hideBackground
        contentStyle={styles.screenContent}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.prepImageBg}
          resizeMode="cover"
        >
            <View style={styles.prepRoot}>
            <View style={styles.prepInner}>
              <AppHeader
                variant="game"
                title="Party Fun 2"
                right={
                  <AppHeaderIconButton
                    icon="exit-to-app"
                    iconColor="#ffffff"
                    onPress={confirmExitGame}
                  />
                }
              />
              <View style={styles.prepContent}>
                <View style={styles.prepMainBlock}>
                  <GameTurnPrepTeamPill teamKey={currentTeam} />
                  <GameTurnPrepTurnHeading
                    turnNumber={currentPlayerIndex + 1}
                  />
                  <GameTurnPrepPlayerCard name={currentPlayer.name} />
                  <GameTurnPrepStatsRow
                    round={currentPhase}
                    remaining={cardsRemaining}
                  />
                </View>
                <GameTurnPrepStartButton onPress={handleStartTurn} />
              </View>
            </View>
          </View>
        </ImageBackground>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen hideBackground contentStyle={styles.screenContent}>
      <View style={styles.playingWhiteBg}>
        <View style={styles.prepInner}>
          <AppHeader
            title="Party Fun 2"
            right={
              <AppHeaderIconButton
                icon="exit-to-app"
                iconColor={colors.primary}
                onPress={confirmExitGame}
              />
            }
          />
          <View style={styles.screen}>
            <GameTurnPlayingStatsRow
              playerName={currentPlayer.name}
              currentTeam={currentTeam}
              correctCount={currentTurnCards.correct.length}
              incorrectCount={currentTurnCards.incorrect.length}
              timerSeconds={timer}
              maxTimerSeconds={TURN_TIME}
            />
            <GameTurnPlayingWordCard
              cardText={currentCard ?? ""}
            />
            <GameTurnPlayingActionRow
              onIncorrect={handleIncorrect}
              onCorrect={handleCorrect}
            />
          </View>
        </View>
      </View>
    </CustomScreen>
  );
};

export default GameTurnScreen;
