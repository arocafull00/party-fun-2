import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";

import { homeScreenColors, styles } from "../home-screen.styles";
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
          <Button
            mode="elevated"
            onPress={onNewGame}
            icon="play"
            buttonColor={homeScreenColors.ctaBlue}
            textColor="#FFFFFF"
            style={styles.homePrimaryButton}
            contentStyle={styles.homePrimaryButtonContent}
            labelStyle={styles.homePrimaryButtonLabel}
          >
            Nueva partida
          </Button>
          <View style={styles.actionButtons}>
            <View style={styles.actionButtonItem}>
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
            <View style={styles.actionButtonItem}>
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
                Reglas
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
