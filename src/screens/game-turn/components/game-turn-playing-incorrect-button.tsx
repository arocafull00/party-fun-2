import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "react-native-paper";

import { colors } from "../../../theme/theme";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingIncorrectButtonProps = {
  onPress: () => void;
};

export function GameTurnPlayingIncorrectButton({
  onPress,
}: GameTurnPlayingIncorrectButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.playingRoundActionHit,
        pressed && styles.playingRoundActionPressed,
      ]}
    >
      <View style={styles.playingRoundActionInner}>
        <View style={styles.playingIncorrectDecorWrap}>
          <View style={[styles.playingIncorrectRay, styles.playingIncorrectRayA]} />
          <View style={[styles.playingIncorrectRay, styles.playingIncorrectRayB]} />
          <View style={[styles.playingIncorrectRay, styles.playingIncorrectRayC]} />
        </View>
        <View style={styles.playingIncorrectCircle}>
          <Icon source="close" size={48} color={colors.textLight} />
        </View>
      </View>
    </Pressable>
  );
}
