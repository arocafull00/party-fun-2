import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingPhasePillProps = {
  label: string;
};

export function GameTurnPlayingPhasePill({
  label,
}: GameTurnPlayingPhasePillProps) {
  return (
    <View style={styles.playingPhasePillShadow}>
      <View style={styles.playingPhasePillInner}>
        <Text style={styles.playingPhasePillText}>{label}</Text>
      </View>
    </View>
  );
}
