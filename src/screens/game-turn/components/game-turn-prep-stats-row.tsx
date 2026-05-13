import React from "react";
import { View } from "react-native";

import { GameTurnPrepStatCard } from "./game-turn-prep-stat-card";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepStatsRowProps = {
  round: number;
  remaining: number;
  onRoundPress: () => void;
};

function roundModeSubtitle(phase: number): string {
  if (phase === 2) return "1 palabra";
  if (phase === 3) return "mímica";
  return "pista libre";
}

export const GameTurnPrepStatsRow = React.memo(function GameTurnPrepStatsRow({
  round,
  remaining,
  onRoundPress,
}: GameTurnPrepStatsRowProps) {
  return (
    <View style={styles.prepStatsRow}>
      <GameTurnPrepStatCard
        label="RONDA"
        value={`${round}`}
        subtitle={roundModeSubtitle(round)}
        icon="refresh"
        variant="round"
        onPress={onRoundPress}
        accessibilityLabel="Cómo jugar"
      />
      <GameTurnPrepStatCard
        label="RESTANTES"
        value={`x${remaining}`}
        icon="timer-sand"
        variant="round"
      />
    </View>
  );
});
