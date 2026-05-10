import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../home-screen.styles";

export const HomeLogoSection: React.FC = () => {
  return (
    <View style={styles.logoSection}>
      <Text style={styles.title}>PARTY</Text>
      <Text style={styles.title}>FUN</Text>
      <Text style={styles.subtitle}>Game</Text>
    </View>
  );
};
