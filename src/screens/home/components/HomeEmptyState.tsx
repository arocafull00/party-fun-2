import React from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { BouncyButton } from "../../../shared/components/BouncyButton";
import { styles } from "../home-screen.styles";
import { HomeLogoSection } from "./HomeLogoSection";
import { HomePatternBackground } from "./HomePatternBackground";

interface HomeEmptyStateProps {
  onCreateDeck: () => void;
}

export const HomeEmptyState: React.FC<HomeEmptyStateProps> = ({ onCreateDeck }) => {
  return (
    <View style={styles.screen}>
      <HomePatternBackground keyPrefix="empty" />
      <HomeLogoSection />
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconBox}>
          <Icon source="cards-outline" size={42} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>SIN MAZOS</Text>
        <Text style={styles.emptyDescription}>Crea tu primer mazo para empezar a jugar.</Text>
        <BouncyButton
          label="Crear mazos"
          onPress={onCreateDeck}
          variant="primary"
          icon="plus"
        />
      </View>
    </View>
  );
};
