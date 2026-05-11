import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { SparkleBurst } from "../../home/components/SparkleBurst";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepTurnHeadingProps = {
  turnNumber: number;
};

export function GameTurnPrepTurnHeading({
  turnNumber,
}: GameTurnPrepTurnHeadingProps) {
  return (
    <View style={styles.prepHeadingBlock}>
      <View style={styles.prepTurnRow}>
        <SparkleBurst />
        <Text style={styles.prepTurnText}>TURNO {turnNumber}</Text>
        <SparkleBurst mirror />
      </View>
      <Text style={styles.prepPickupTitle}>Coge el móvil</Text>
    </View>
  );
}
