import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { styles } from "../home-screen.styles";
import { HomePatternBackground } from "./HomePatternBackground";

export const HomeLoadingState: React.FC = () => {
  return (
    <View style={styles.screen}>
      <HomePatternBackground keyPrefix="loading" />
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color={colors.textLight} />
        <Text style={styles.loadingText}>Cargando inicio...</Text>
      </View>
    </View>
  );
};
