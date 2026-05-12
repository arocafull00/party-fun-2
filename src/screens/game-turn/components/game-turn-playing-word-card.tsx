import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingWordCardProps = {
  cardText: string;
};

export function GameTurnPlayingWordCard({
  cardText,
}: GameTurnPlayingWordCardProps) {
  return (
    <View style={styles.playingWordCard}>
      <Text style={styles.playingWordLabel}>PALABRA</Text>
      <Text style={styles.playingWordText} numberOfLines={3}>
        {cardText}
      </Text>
    </View>
  );
}
