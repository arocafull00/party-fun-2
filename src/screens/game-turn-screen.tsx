import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Alert, BackHandler, ImageBackground } from "react-native";
import { Text, Button } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { setAudioModeAsync, useAudioPlayer, type AudioPlayer } from "expo-audio";

import {
  TURN_TIME,
  useTimer,
  useCurrentTurnCards,
  useCurrentTeam,
  useCurrentPlayerIndex,
  useTeams,
  useCurrentPhase,
  useGameStarted,
  useGameActions,
} from "../store/game-store";
import { TimerEngine } from "../engine/timer-engine";
import { colors, spacing } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { AppHeader } from "../shared/components/app-header";
import { AppHeaderIconButton } from "../shared/components/app-header-icon-button";
import { GameTurnPrepTeamPill } from "./game-turn/components/game-turn-prep-team-pill";
import { GameTurnPrepTurnHeading } from "./game-turn/components/game-turn-prep-turn-heading";
import { GameTurnPrepPlayerCard } from "./game-turn/components/game-turn-prep-player-card";
import { GameTurnPrepStatsRow } from "./game-turn/components/game-turn-prep-stats-row";
import { GameTurnPrepStartButton } from "./game-turn/components/game-turn-prep-start-button";
import { GameTurnPlayingActionRow } from "./game-turn/components/game-turn-playing-action-row";
import { GameTurnPlayingStatsRow } from "./game-turn/components/game-turn-playing-stats-row";
import { GameTurnPlayingWordCard } from "./game-turn/components/game-turn-playing-word-card";
import { styles } from "./game-turn-screen.styles";
import { DotsBackground } from "../shared/components/DotsBackground";

const backgroundImage = require("../../assets/background.jpg");
const successSoundAsset = require("../../assets/sound/success.mp3");
const errorSoundAsset = require("../../assets/sound/error.wav");

const HOW_TO_PLAY_MESSAGE =
  "Ronda 1 — Pista libre\nPuedes hablar y dar pistas, pero no digas la palabra objetivo ni palabras demasiado relacionadas con ella. Si marcas un fallo, pierdes 5 segundos del tiempo restante.\n\nRonda 2 — Una palabra\nSolo puedes usar una única palabra como pista por carta. Los fallos no restan tiempo.\n\nRonda 3 — Mímica\nExplica la carta solo con gestos y movimientos, sin hablar. Los fallos no restan tiempo.\n\nLos equipos alternan turnos. Cuando se acabe el tiempo o las cartas del turno, se revisan los aciertos y la partida sigue.";

const GameTurnScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const currentPhase = useCurrentPhase();
  const currentTeam = useCurrentTeam();
  const currentPlayerIndex = useCurrentPlayerIndex();
  const teams = useTeams();
  const timer = useTimer();
  const currentTurnCards = useCurrentTurnCards();
  const gameStarted = useGameStarted();
  const { setTimer, setIsTimerRunning, markCardCorrect, markCardIncorrect, endGame } =
    useGameActions();

  const [gamePhase, setGamePhase] = useState<"preparation" | "playing">(
    "preparation"
  );

  const timerEngineRef = useRef<TimerEngine | null>(null);
  const successPlayer = useAudioPlayer(successSoundAsset);
  const errorPlayer = useAudioPlayer(errorSoundAsset);

  const currentTeamData = teams[currentTeam];
  const currentPlayer = currentTeamData.players[currentPlayerIndex];
  const currentCard = currentTurnCards.unplayed[0];
  const cardsRemaining = currentTurnCards.unplayed.length;

  const handleExitGame = useCallback(() => {
    timerEngineRef.current?.stop();
    endGame();
    router.push("/");
  }, [endGame]);

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

  const showHowToPlay = useCallback(() => {
    Alert.alert("Cómo jugar", HOW_TO_PLAY_MESSAGE, [{ text: "Entendido" }]);
  }, []);

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
    if (gamePhase !== "playing") return;
    if (cardsRemaining > 0) return;

    timerEngineRef.current?.stop();
    setIsTimerRunning(false);
    setGamePhase("preparation");
    router.push("/turn-review?reason=out-of-cards");
  }, [cardsRemaining, gamePhase, setIsTimerRunning]);

  useEffect(() => {
    return () => {
      timerEngineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "duckOthers",
      interruptionModeAndroid: "duckOthers",
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    });
  }, []);

  const playFeedback = useCallback((player: AudioPlayer) => {
    player.play();
    void player.seekTo(0);
  }, []);

  const handleTimeUp = useCallback(() => {
    timerEngineRef.current?.stop();
    setIsTimerRunning(false);
    setGamePhase("preparation");
    setTimer(TURN_TIME);
    router.push("/turn-review");
  }, [setIsTimerRunning, setTimer]);

  const handleStartTurn = () => {
    if (cardsRemaining === 0) {
      timerEngineRef.current?.stop();
      setIsTimerRunning(false);
      setGamePhase("preparation");
      router.push("/turn-review?reason=out-of-cards");
      return;
    }

    const initialTimer = timer > 0 ? timer : TURN_TIME;
    setGamePhase("playing");
    setIsTimerRunning(true);
    timerEngineRef.current?.stop();
    timerEngineRef.current = new TimerEngine(
      initialTimer,
      (remaining) => setTimer(remaining),
      handleTimeUp
    );

    timerEngineRef.current.start();
  };

  const handleCorrect = () => {
    if (!currentCard) return;
    playFeedback(successPlayer);

    markCardCorrect(currentCard);

    if (cardsRemaining <= 1) {
      timerEngineRef.current?.stop();
      setIsTimerRunning(false);
      setGamePhase("preparation");
      router.push("/turn-review?reason=out-of-cards");
      return;
    }
  };

  const handleIncorrect = () => {
    if (!currentCard) return;
    playFeedback(errorPlayer);

    markCardIncorrect(currentCard);

    if (currentPhase === 1) {
      timerEngineRef.current?.reduceTime(5);
    }

    if (cardsRemaining <= 1) {
      timerEngineRef.current?.stop();
      setIsTimerRunning(false);
      setGamePhase("preparation");
      router.push("/turn-review?reason=out-of-cards");
      return;
    }
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
                title="Funny Words"
                left={
                  <AppHeaderIconButton
                    icon="help-circle-outline"
                    iconColor="#ffffff"
                    accessibilityLabel="Cómo jugar"
                    onPress={showHowToPlay}
                  />
                }
                right={
                  <AppHeaderIconButton
                    icon="exit-to-app"
                    iconColor="#ffffff"
                    onPress={confirmExitGame}
                  />
                }
              />
              <View
                style={[
                  styles.prepContent,
                  {
                    paddingLeft: spacing.lg + insets.left,
                    paddingRight: spacing.lg + insets.right,
                    paddingBottom: spacing.xl + insets.bottom,
                  },
                ]}
              >
                <View style={styles.prepMainBlock}>
                  <GameTurnPrepTeamPill teamKey={currentTeam} />
                  <GameTurnPrepTurnHeading
                  />
                  <GameTurnPrepPlayerCard name={currentPlayer.name} />
                  <GameTurnPrepStatsRow
                    round={currentPhase}
                    remaining={cardsRemaining}
                    onRoundPress={showHowToPlay}
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
      <View
        style={[
          styles.playingWhiteBg,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View style={styles.prepInner}>
        <DotsBackground />
          <AppHeader
            title="Funny Words"
            left={
              <AppHeaderIconButton
                icon="help-circle-outline"
                iconColor={colors.primary}
                accessibilityLabel="Cómo jugar"
                onPress={showHowToPlay}
              />
            }
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
