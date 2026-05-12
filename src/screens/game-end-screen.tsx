import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text } from "react-native-paper";

import { database } from "../database/database";
import { useGameStore } from "../store/game-store";
import { colors, spacing } from "../theme/theme";
import { AppHeader } from "../shared/components/app-header";
import { CustomScreen } from "../shared/components/CustomScreen";
import { DotsBackground } from "../shared/components/DotsBackground";
import { FinalTeamCard } from "./game-end/components/final-team-card";
import { RoundSummaryRow } from "./game-end/components/round-summary-row";
import { styles } from "./game-end-screen.styles";

const GameEndScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { teams, selectedDeck, gameHistory, resetGame } = useGameStore();
  const [saving, setSaving] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);

  const blueScore = teams.azul.score;
  const redScore = teams.rojo.score;

  const winner = useMemo(() => {
    if (blueScore > redScore) {
      return "azul";
    }

    if (redScore > blueScore) {
      return "rojo";
    }

    return "empate";
  }, [blueScore, redScore]);

  const totalCards = useMemo(() => {
    return gameHistory.reduce((total, round) => {
      return total + round.correctCards.length + round.incorrectCards.length;
    }, 0);
  }, [gameHistory]);

  const totalCorrect = useMemo(() => {
    return gameHistory.reduce((total, round) => {
      return total + round.correctCards.length;
    }, 0);
  }, [gameHistory]);

  const accuracy = useMemo(() => {
    if (totalCards === 0) {
      return 0;
    }

    return Math.round((totalCorrect / totalCards) * 100);
  }, [totalCards, totalCorrect]);

  const roundSummaries = useMemo(() => {
    return gameHistory.map((round, index) => {
      const previousScores =
        index === 0 ? { azul: 0, rojo: 0 } : gameHistory[index - 1].teamScores;
      const blueCorrect = Math.max(0, round.teamScores.azul - previousScores.azul);
      const redCorrect = Math.max(0, round.teamScores.rojo - previousScores.rojo);

      return {
        roundNumber: round.roundNumber || index + 1,
        blueCorrect,
        redCorrect,
      };
    });
  }, [gameHistory]);

  useEffect(() => {
    const saveGameToDatabase = async () => {
      if (gameSaved) {
        return;
      }

      if (saving) {
        return;
      }

      setSaving(true);

      try {
        const gameData = {
          fecha: new Date().toISOString(),
          mazoId: selectedDeck?.id || 0,
          equipoGanador: winner === "empate" ? null : (winner as "azul" | "rojo"),
          puntuacionAzul: blueScore,
          puntuacionRojo: redScore,
          totalCartas: totalCards,
          cartasCorrectas: totalCorrect,
          precision: accuracy,
        };

        const gameId = await database.createPartida(gameData);
        const allPlayers = [...teams.azul.players, ...teams.rojo.players];

        for (const player of allPlayers) {
          const equipo: "azul" | "rojo" = teams.azul.players.includes(player)
            ? "azul"
            : "rojo";
          const playerData = {
            nombre: player.name,
            equipo,
          };
          const playerId = await database.createJugador(playerData);
          await database.addPlayerToGame(gameId, playerId, equipo);
        }

        setGameSaved(true);
      } catch {
      } finally {
        setSaving(false);
      }
    };

    saveGameToDatabase();
  }, [
    accuracy,
    blueScore,
    gameSaved,
    redScore,
    saving,
    selectedDeck?.id,
    teams.azul.players,
    teams.rojo.players,
    totalCards,
    totalCorrect,
    winner,
  ]);

  const handleNewGame = () => {
    resetGame();
    router.push("/new-game");
  };

  const handleBackToHome = () => {
    resetGame();
    router.push("/");
  };

  const handleViewStatistics = () => {
    router.push("/statistics");
  };

  return (
    <CustomScreen contentStyle={styles.container} header={<AppHeader />}>
      <DotsBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: spacing.md + insets.left,
            paddingRight: spacing.md + insets.right,
            paddingBottom: spacing.lg + insets.bottom,
          },
        ]}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>¡Juego terminado!</Text>
          <Text style={styles.subtitle}>Así han quedado los equipos</Text>
        </View>

        <View style={styles.teamCardsRow}>
          <FinalTeamCard
            title="Equipo Azul"
            score={blueScore}
            members={teams.azul.players.map((player) => player.name)}
            color={colors.primary}
            winnerLabel={winner === "azul" ? "GANADOR" : undefined}
          />
          <FinalTeamCard
            title="Equipo Rojo"
            score={redScore}
            members={teams.rojo.players.map((player) => player.name)}
            color={colors.redTeam}
            winnerLabel={winner === "rojo" ? "GANADOR" : undefined}
          />
        </View>

        <View style={styles.roundsCard}>
          <View style={styles.roundsHeader}>
            <Text style={styles.roundsHeaderRound}>Ronda</Text>
            <Text style={[styles.roundsHeaderTeam, { color: colors.primary }]}>Azul</Text>
            <Text style={[styles.roundsHeaderTeam, { color: colors.redTeam }]}>Rojo</Text>
          </View>

          <View style={styles.roundsBody}>
            {roundSummaries.map((round, index) => (
              <RoundSummaryRow
                key={`${round.roundNumber}-${index}`}
                roundNumber={round.roundNumber}
                blueCorrect={round.blueCorrect}
                redCorrect={round.redCorrect}
              />
            ))}
            {roundSummaries.length === 0 ? (
              <Text style={styles.emptyRoundsText}>Sin rondas registradas</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={handleNewGame}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor={colors.primary}
          >
            Nueva partida
          </Button>

          <Button
            mode="contained-tonal"
            onPress={handleViewStatistics}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Ver estadísticas
          </Button>

          <Button
            mode="contained-tonal"
            onPress={handleBackToHome}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Volver al inicio
          </Button>
        </View>

        {gameSaved ? <Text style={styles.saveStatus}>Partida guardada</Text> : null}
      </ScrollView>
    </CustomScreen>
  );
};

export default GameEndScreen;