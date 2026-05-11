import React from "react";
import { View } from "react-native";

import { styles } from "../../game-turn-screen.styles";

import { GameTurnPlayingCorrectButton } from "./game-turn-playing-correct-button";
import { GameTurnPlayingIncorrectButton } from "./game-turn-playing-incorrect-button";
import { GameTurnPlayingPhasePill } from "./game-turn-playing-phase-pill";

type GameTurnPlayingActionRowProps = {
  phaseLabel: string;
  onIncorrect: () => void;
  onCorrect: () => void;
};

export function GameTurnPlayingActionRow({
  phaseLabel,
  onIncorrect,
  onCorrect,
}: GameTurnPlayingActionRowProps) {
  return (
    <View style={styles.playingActionRow}>
      <GameTurnPlayingIncorrectButton onPress={onIncorrect} />
      <View style={styles.playingPhasePillSlot}>
        <GameTurnPlayingPhasePill label={phaseLabel} />
      </View>
      <GameTurnPlayingCorrectButton onPress={onCorrect} />
    </View>
  );
}
