import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { database } from "../database/database";
import { useGameStore } from "../store/game-store";
import { CustomScreen } from "../shared/components/CustomScreen";
import { HomeEmptyState } from "./home/components/HomeEmptyState";
import { HomeLoadingState } from "./home/components/HomeLoadingState";
import { HomeMainContent } from "./home/components/HomeMainContent";
import { styles } from "./home/home-screen.styles";

export const HomeScreen: React.FC = () => {
  const { setDecks, decks } = useGameStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasOngoingGame, setHasOngoingGame] = useState(false);

  useEffect(() => {
    loadDecks();
    checkOngoingGame();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const decksData = await database.getMazos();
      setDecks(decksData);
    } catch (error) {
      console.error("Error loading decks:", error);
      Alert.alert("Error", "No se pudieron cargar los mazos");
    } finally {
      setLoading(false);
    }
  };

  const checkOngoingGame = async () => {
    try {
      const ongoingGame = await database.getPartidaActual();
      setHasOngoingGame(!!ongoingGame);
    } catch (error) {
      console.error("Error checking ongoing game:", error);
    }
  };

  const handleNewGame = () => {
    if (decks.length === 0) {
      Alert.alert(
        "Sin mazos",
        "Necesitas crear al menos un mazo de cartas para jugar",
        [{ text: "OK" }]
      );
      return;
    }
    router.push("/new-game");
  };

  const handleContinueGame = () => {
    Alert.alert("Continuar Partida", "Funcionalidad en desarrollo");
  };

  if (loading) {
    return (
      <CustomScreen contentStyle={styles.screenContent}>
        <HomeLoadingState />
      </CustomScreen>
    );
  }

  if (decks.length === 0) {
    return (
      <CustomScreen contentStyle={styles.screenContent}>
        <HomeEmptyState onCreateDeck={() => router.push("/create-deck")} />
      </CustomScreen>
    );
  }

  return (
    <CustomScreen contentStyle={styles.screenContent}>
      <HomeMainContent
        hasOngoingGame={hasOngoingGame}
        onNewGame={handleNewGame}
        onContinueGame={handleContinueGame}
        onOpenDeckManagement={() => router.push("/deck-management")}
        onOpenStatistics={() => router.push("/statistics")}
      />
    </CustomScreen>
  );
};
