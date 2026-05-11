import React from "react";
import { View } from "react-native";

import { styles } from "../../game-turn-screen.styles";

import { GameTurnPlayingTeamScore } from "./game-turn-playing-team-score";
import { GameTurnPlayingTimerRing } from "./game-turn-playing-timer-ring";

type GameTurnPlayingStatsRowProps = {
  rojoScore: number;
  azulScore: number;
  timerSeconds: number;
  maxTimerSeconds: number;
};

export function GameTurnPlayingStatsRow({
  rojoScore,
  azulScore,
  timerSeconds,
  maxTimerSeconds,
}: GameTurnPlayingStatsRowProps) {
  return (
    <View style={styles.playingStatsRow}>
      <GameTurnPlayingTeamScore variant="rojo" score={rojoScore} />
      <GameTurnPlayingTimerRing
        seconds={timerSeconds}
        maxSeconds={maxTimerSeconds}
      />
      <GameTurnPlayingTeamScore variant="azul" score={azulScore} />
    </View>
  );
}
