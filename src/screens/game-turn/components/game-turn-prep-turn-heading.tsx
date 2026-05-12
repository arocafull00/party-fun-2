import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";


export function GameTurnPrepTurnHeading() {
  return (
    <View style={styles.prepHeadingBlock}>
      <Text style={styles.prepPickupTitle}>Coge el móvil</Text>
    </View>
  );
}
