import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Alert, BackHandler, ImageBackground } from "react-native";
import { Text, Button, Dialog, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import { useGameStore } from "../store/game-store";
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
import { GameTurnPlayingBackground } from "./game-turn/components/game-turn-playing-background";
import { GameTurnPlayingFooter } from "./game-turn/components/game-turn-playing-footer";
import { GameTurnPlayingHeaderLeft } from "./game-turn/components/game-turn-playing-header-left";
import { GameTurnPlayingStatsRow } from "./game-turn/components/game-turn-playing-stats-row";
import { GameTurnPlayingWordCard } from "./game-turn/components/game-turn-playing-word-card";
import { styles } from "./game-turn-screen.styles";

const TURN_TIME = 30;

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
    setTimer,
    setIsTimerRunning,
    markCardCorrect,
    markCardIncorrect,
    nextCard,
    gameStarted,
  } = useGameStore();

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [gamePhase, setGamePhase] = useState<"preparation" | "playing">(
    "preparation"
  );

  const timerEngineRef = useRef<TimerEngine | null>(null);

  const currentTeamData = teams[currentTeam];
  const currentPlayer = currentTeamData.players[currentPlayerIndex];
  const currentCard = phaseCards[currentCardIndex];
  const cardsRemaining = phaseCards.length - currentCardIndex;

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

  const handleExitGame = () => {
    timerEngineRef.current?.stop();
    setShowExitDialog(false);
    router.push("/");
  };

  const phaseLabel =
    currentPhase === 1
      ? "PISTA LIBRE"
      : currentPhase === 2
        ? "¡UNA PALABRA!"
        : "MÍMICA";

  const deckProgress =
    phaseCards.length > 0
      ? Math.min(1, (currentCardIndex + 1) / phaseCards.length)
      : 0;

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
                title="Party Fun 2"
                left={<AppHeaderIconButton icon="account" />}
                right={
                  <AppHeaderIconButton
                    icon="cog"
                    iconColor={colors.primary}
                    onPress={() => setShowExitDialog(true)}
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
    <CustomScreen hideBackground contentStyle={styles.screenContent}>
      <GameTurnPlayingBackground>
        <View style={styles.prepInner}>
          <AppHeader
            title="Party Fun 2"
            left={<GameTurnPlayingHeaderLeft playerName={currentPlayer.name} />}
            right={
              <AppHeaderIconButton
                icon="cog"
                iconColor={colors.primary}
                onPress={() => setShowExitDialog(true)}
              />
            }
          />
          <View style={styles.screen}>
            <GameTurnPlayingStatsRow
              rojoScore={teams.rojo.score}
              azulScore={teams.azul.score}
              timerSeconds={timer}
              maxTimerSeconds={TURN_TIME}
            />
            <GameTurnPlayingWordCard
              phase={currentPhase}
              cardText={currentCard ?? ""}
              progressInDeck={deckProgress}
            />
            <GameTurnPlayingActionRow
              phaseLabel={phaseLabel}
              onIncorrect={handleIncorrect}
              onCorrect={handleCorrect}
            />
            <GameTurnPlayingFooter playerName={currentPlayer.name} />
          </View>
        </View>
      </GameTurnPlayingBackground>
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

export default GameTurnScreen;
