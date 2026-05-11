import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingWordCardProps = {
  phase: number;
  cardText: string;
  progressInDeck: number;
};

export function GameTurnPlayingWordCard({
  phase,
  cardText,
  progressInDeck,
}: GameTurnPlayingWordCardProps) {
  const phaseLetter =
    phase === 1 ? "P" : phase === 2 ? "1" : "M";
  const filledFlex = Math.max(0.001, progressInDeck);
  const emptyFlex = Math.max(0.001, 1 - progressInDeck);

  return (
    <View style={styles.playingWordCard}>
      <View style={styles.playingWordBadgeTL}>
        <Text style={styles.playingWordBadgeText}>{phaseLetter}</Text>
      </View>
      <Text style={styles.playingWordText} numberOfLines={3}>
        {cardText}
      </Text>
      <View style={styles.playingWordProgressTrack}>
        <View
          style={[styles.playingWordProgressFill, { flex: filledFlex }]}
        />
        <View style={{ flex: emptyFlex }} />
      </View>
      <View style={styles.playingWordBadgeBR}>
        <Text style={styles.playingWordBadgeText}>F</Text>
      </View>
    </View>
  );
}
