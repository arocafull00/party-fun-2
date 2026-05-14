import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Button } from "react-native-paper";

import { homeScreenColors, styles } from "../home-screen.styles";
import { HomeLogoSection } from "./HomeLogoSection";
import { useRouter } from "expo-router";
import { useGameHydrated, useGameStarted } from "../../../store/game-store";

export const HomeMainContent: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const hasHydrated = useGameHydrated();
  const gameStarted = useGameStarted();
  const shouldStackSecondaryButtons = width < 420;

  const onNewGame = () => {
    if (!hasHydrated) return;
    if (gameStarted) {
      router.push("/game-turn");
      return;
    }
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
          <Button
            mode="elevated"
            onPress={onNewGame}
            icon="play"
            buttonColor={homeScreenColors.ctaBlue}
            textColor="#FFFFFF"
            disabled={!hasHydrated}
            style={styles.homePrimaryButton}
            contentStyle={styles.homePrimaryButtonContent}
            labelStyle={styles.homePrimaryButtonLabel}
          >
            {!hasHydrated
              ? "Cargando partida..."
              : gameStarted
                ? "Continuar partida"
                : "Nueva partida"}
          </Button>
          <View
            style={[
              styles.actionButtons,
              shouldStackSecondaryButtons && styles.actionButtonsStacked,
            ]}
          >
            <View
              style={[
                styles.actionButtonItem,
                shouldStackSecondaryButtons && styles.actionButtonItemFullWidth,
              ]}
            >
              <Button
                mode="contained"
                onPress={onOpenDeckManagement}
                icon="cards"
                buttonColor="transparent"
                textColor="#FFFFFF"
                rippleColor="rgba(255, 255, 255, 0.18)"
                style={styles.homeSecondaryButton}
                contentStyle={styles.homeSecondaryButtonContent}
                labelStyle={styles.homeSecondaryButtonLabel}
              >
                Cartas
              </Button>
            </View>
            <View
              style={[
                styles.actionButtonItem,
                shouldStackSecondaryButtons && styles.actionButtonItemFullWidth,
              ]}
            >
              <Button
                mode="contained"
                onPress={onOpenStatistics}
                icon="clipboard-text-outline"
                buttonColor="transparent"
                textColor="#FFFFFF"
                rippleColor="rgba(255, 255, 255, 0.18)"
                style={styles.homeSecondaryButton}
                contentStyle={styles.homeSecondaryButtonContent}
                labelStyle={styles.homeSecondaryButtonLabel}
              >
                Estadísticas
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
