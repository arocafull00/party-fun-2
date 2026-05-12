import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingStatsRowProps = {
  playerName: string;
  currentTeam: "azul" | "rojo";
  correctCount: number;
  incorrectCount: number;
  timerSeconds: number;
  maxTimerSeconds: number;
};

export function GameTurnPlayingStatsRow({
  playerName,
  currentTeam,
  correctCount,
  incorrectCount,
  timerSeconds,
  maxTimerSeconds,
}: GameTurnPlayingStatsRowProps) {
  const teamColor = currentTeam === "rojo" ? colors.redTeam : colors.primary;
  const safeSeconds = Math.max(0, Math.floor(timerSeconds));
  const m = Math.floor(safeSeconds / 60);
  const s = safeSeconds % 60;
  const timeLabel = `${m}:${s.toString().padStart(2, "0")}`;
  const progress =
    maxTimerSeconds > 0
      ? Math.min(1, Math.max(0, timerSeconds / maxTimerSeconds))
      : 0;

  return (
    <View style={styles.playingStatsCompactWrap}>
      <View style={styles.playingStatsCompactRow}>
        <Text style={styles.playingStatsCompactTime}>{timeLabel}</Text>
        <View style={styles.playingStatsCompactNameLayer} pointerEvents="box-none">
          <View
            style={[styles.playingStatsPlayerBadge, { backgroundColor: teamColor }]}
          >
            <Text
              style={styles.playingStatsPlayerBadgeText}
              numberOfLines={1}
            >
              {playerName}
            </Text>
          </View>
        </View>
        <View style={styles.playingStatsCompactCounts}>
          <Text style={[styles.playingStatsCompactCount, { color: colors.primary }]}>
            {correctCount}
          </Text>
          <Text style={styles.playingStatsCompactCountSep}>·</Text>
          <Text
            style={[styles.playingStatsCompactCount, { color: colors.redTeam }]}
          >
            {incorrectCount}
          </Text>
        </View>
      </View>
      <View style={styles.playingStatsCompactTrack}>
        <View
          style={[styles.playingStatsCompactFill, { width: `${progress * 100}%` }]}
        />
      </View>
    </View>
  );
}
