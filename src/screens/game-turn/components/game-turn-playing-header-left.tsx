import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingHeaderLeftProps = {
  playerName: string;
};

export function GameTurnPlayingHeaderLeft({
  playerName,
}: GameTurnPlayingHeaderLeftProps) {
  const initial = playerName.trim().charAt(0).toUpperCase();
  if (!initial) {
    return <View style={styles.playingAvatarPill} />;
  }

  return (
    <View style={styles.playingAvatarPill}>
      <Text style={styles.playingAvatarInitial}>{initial}</Text>
    </View>
  );
}
