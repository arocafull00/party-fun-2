import React from "react";
import { View } from "react-native";

import { GameTurnPrepStatCard } from "./game-turn-prep-stat-card";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepStatsRowProps = {
  round: number;
  remaining: number;
};

export function GameTurnPrepStatsRow({
  round,
  remaining,
}: GameTurnPrepStatsRowProps) {
  return (
    <View style={styles.prepStatsRow}>
      <GameTurnPrepStatCard
        label="RONDA"
        value={`${round}`}
        icon="refresh"
        variant="round"
      />
      <GameTurnPrepStatCard
        label="RESTANTES"
        value={`x${remaining}`}
        icon="timer-sand"
        variant="remaining"
      />
    </View>
  );
}
