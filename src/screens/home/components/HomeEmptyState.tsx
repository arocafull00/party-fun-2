import React from "react";
import { View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";


import { colors } from "../../../theme/theme";
import { styles } from "../home-screen.styles";
import { HomeLogoSection } from "./HomeLogoSection";
import { useRouter } from "expo-router";

export const HomeEmptyState: React.FC = () => {
  const router = useRouter();
  const onCreateDeck = () => {
    router.push("/create-deck");
  };
  return (
    <View style={styles.screen}>
      <View style={styles.homeCenteredBody}>
        <HomeLogoSection />
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
            <Icon source="cards-outline" size={42} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>SIN MAZOS</Text>
          <Text style={styles.emptyDescription}>Crea tu primer mazo para empezar a jugar.</Text>
          <Button mode="contained" onPress={onCreateDeck} icon="plus">
            Crear mazos
          </Button>
        </View>
      </View>
    </View>
  );
};
