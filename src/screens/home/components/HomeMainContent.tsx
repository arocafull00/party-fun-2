import React from "react";
import { ScrollView, View } from "react-native";

import { BouncyButton } from "../../../shared/components/BouncyButton";
import { styles } from "../home-screen.styles";
import { HomeLogoSection } from "./HomeLogoSection";

interface HomeMainContentProps {
  onNewGame: () => void;
  onOpenDeckManagement: () => void;
  onOpenStatistics: () => void;
}

export const HomeMainContent: React.FC<HomeMainContentProps> = ({
  onNewGame,
  onOpenDeckManagement,
  onOpenStatistics,
}) => {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.mainScrollCentered}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainActionsColumn}>
          <HomeLogoSection />
          <BouncyButton
            label="Nueva partida"
            onPress={onNewGame}
            variant="primary"
          />
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
        </View>
      </ScrollView>
    </View>
  );
};
