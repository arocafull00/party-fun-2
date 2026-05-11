import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { styles } from "../home-screen.styles";

export const HomeLoadingState: React.FC = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color={'#ffffff'} />
        <Text style={styles.loadingText}>Cargando inicio...</Text>
      </View>
    </View>
  );
};
