import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";

import { styles } from "../home-screen.styles";
import { HomeLogoSection } from "./HomeLogoSection";
import { useRouter } from "expo-router";

export const HomeMainContent: React.FC = () => {
  const router = useRouter();
  const onNewGame = () => {
    router.push("/new-game");
  };
  const onOpenDeckManagement = () => {
    router.push("/deck-management");
  };
  const onOpenStatistics = () => {
    router.push("/statistics");
  };
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.mainScrollCentered}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainActionsColumn}>
          <HomeLogoSection />
          <Button mode="contained" onPress={onNewGame}>
            Nueva partida
          </Button>
          <View style={styles.actionButtons}>
            <View style={styles.actionButtonItem}>
              <Button
                mode="contained-tonal"
                onPress={onOpenDeckManagement}
                icon="cards"
              >
                CARTAS
              </Button>
            </View>
            <View style={styles.actionButtonItem}>
              <Button
                mode="contained-tonal"
                onPress={onOpenStatistics}
                icon="clipboard-text-outline"
              >
                REGLAS
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
