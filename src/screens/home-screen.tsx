import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { useDecks } from "../hooks/useDecks";
import { CustomScreen } from "../shared/components/CustomScreen";
import { HomeEmptyState } from "./home/components/HomeEmptyState";
import { HomeLoadingState } from "./home/components/HomeLoadingState";
import { HomeMainContent } from "./home/components/HomeMainContent";
import { styles } from "./home/home-screen.styles";

export const HomeScreen: React.FC = () => {
  const { decks, loading } = useDecks();
  const router = useRouter();

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

  if (loading) {
    return (
      <CustomScreen
        contentStyle={styles.screenContent}
        hideBackground
      >
        <HomeLoadingState />
      </CustomScreen>
    );
  }

  if (decks.length === 0) {
    return (
      <CustomScreen
        contentStyle={styles.screenContent}
        hideBackground
      >
        <HomeEmptyState/>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen
      contentStyle={styles.screenContent}
      hideBackground
    >
      <HomeMainContent
        onNewGame={handleNewGame}
        onOpenDeckManagement={() => router.push("/deck-management")}
        onOpenStatistics={() => router.push("/statistics")}
      />
    </CustomScreen>
  );
};
