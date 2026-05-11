import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingTeamScoreProps = {
  variant: "rojo" | "azul";
  score: number;
};

export function GameTurnPlayingTeamScore({
  variant,
  score,
}: GameTurnPlayingTeamScoreProps) {
  const label =
    variant === "rojo" ? "TEAM RED" : "TEAM BLUE";
  const labelStyle =
    variant === "rojo"
      ? styles.playingTeamLabelRed
      : styles.playingTeamLabelBlue;
  const boxStyle =
    variant === "rojo"
      ? styles.playingScoreBoxRed
      : styles.playingScoreBoxBlue;
  const valueStyle =
    variant === "rojo"
      ? styles.playingScoreValueRed
      : styles.playingScoreValueBlue;
  const shadowStyle =
    variant === "rojo"
      ? styles.playingScoreBoxShadowRed
      : styles.playingScoreBoxShadowBlue;

  return (
    <View style={styles.playingTeamScoreColumn}>
      <Text style={labelStyle}>{label}</Text>
      <View style={shadowStyle}>
        <View style={[styles.playingScoreBoxInner, boxStyle]}>
          <Text style={[styles.playingScoreValueText, valueStyle]}>{score}</Text>
        </View>
      </View>
    </View>
  );
}
