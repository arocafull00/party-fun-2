import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import Svg, { Circle } from "react-native-svg";

import { colors } from "../../../theme/theme";

import { styles } from "../../game-turn-screen.styles";

const SIZE = 140;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRC = 2 * Math.PI * R;

type GameTurnPlayingTimerRingProps = {
  seconds: number;
  maxSeconds: number;
};

export function GameTurnPlayingTimerRing({
  seconds,
  maxSeconds,
}: GameTurnPlayingTimerRingProps) {
  const progress = maxSeconds > 0 ? Math.min(1, Math.max(0, seconds / maxSeconds)) : 0;
  const dashOffset = CIRC * (1 - progress);

  return (
    <View style={styles.playingTimerRingWrap}>
      <Svg width={SIZE} height={SIZE} style={styles.playingTimerSvg}>
        <Circle
          cx={CX}
          cy={CY}
          r={R}
          stroke={colors.gameTurnTimerTrack}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={CX}
          cy={CY}
          r={R}
          stroke={colors.secondary}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      </Svg>
      <View style={styles.playingTimerCenter} pointerEvents="none">
        <Text style={styles.playingTimerCenterText}>{seconds}</Text>
      </View>
    </View>
  );
}
