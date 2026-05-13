import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

import { GameTurnPlayingCorrectButton } from "./game-turn-playing-correct-button";
import { GameTurnPlayingIncorrectButton } from "./game-turn-playing-incorrect-button";

type GameTurnPlayingActionRowProps = {
  onIncorrect: () => void;
  onCorrect: () => void;
};

export const GameTurnPlayingActionRow = React.memo(function GameTurnPlayingActionRow({
  onIncorrect,
  onCorrect,
}: GameTurnPlayingActionRowProps) {
  return (
    <View style={styles.playingActionColumn}>
      <Text style={styles.playingQuestionText}>¿Has acertado la palabra?</Text>
      <View style={styles.playingButtonsRow}>
        <GameTurnPlayingCorrectButton onPress={onCorrect} />
        <GameTurnPlayingIncorrectButton onPress={onIncorrect} />
      </View>
    </View>
  );
});
