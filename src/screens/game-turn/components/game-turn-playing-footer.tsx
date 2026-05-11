import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingFooterProps = {
  playerName: string;
};

export function GameTurnPlayingFooter({
  playerName,
}: GameTurnPlayingFooterProps) {
  return (
    <View style={styles.playingFooter}>
      <Text style={styles.playingFooterLabel}>TURNO ACTUAL</Text>
      <Text style={styles.playingFooterPlayer}>{playerName}</Text>
      <View style={styles.playingFooterAccent} />
    </View>
  );
}
