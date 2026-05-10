import React from "react";
import { ScrollView, View } from "react-native";

import { BouncyButton } from "../../../shared/components/BouncyButton";
import { styles } from "../home-screen.styles";
import { HomeLogoSection } from "./HomeLogoSection";
import { HomePatternBackground } from "./HomePatternBackground";

interface HomeMainContentProps {
  hasOngoingGame: boolean;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenDeckManagement: () => void;
  onOpenStatistics: () => void;
}

export const HomeMainContent: React.FC<HomeMainContentProps> = ({
  hasOngoingGame,
  onNewGame,
  onContinueGame,
  onOpenDeckManagement,
  onOpenStatistics,
}) => {
  return (
    <View style={styles.screen}>
      <HomePatternBackground keyPrefix="main" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeLogoSection />
        <BouncyButton
          label="Nueva partida"
          onPress={onNewGame}
          variant="primary"
        />
        {hasOngoingGame ? (
          <BouncyButton
            label="CONTINUAR PARTIDA"
            onPress={onContinueGame}
            variant="primary"
            icon="play-circle-outline"
          />
        ) : null}
        <View style={styles.actionButtons}>
          <View style={styles.actionButtonItem}>
            <BouncyButton
              label="CARTAS"
              onPress={onOpenDeckManagement}
              variant="secondary"
              icon="cards"
            />
          </View>
          <View style={styles.actionButtonItem}>
            <BouncyButton
              label="REGLAS"
              onPress={onOpenStatistics}
              variant="secondary"
              icon="clipboard-text-outline"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
