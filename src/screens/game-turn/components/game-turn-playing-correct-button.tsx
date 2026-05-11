import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "react-native-paper";

import { colors } from "../../../theme/theme";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPlayingCorrectButtonProps = {
  onPress: () => void;
};

export function GameTurnPlayingCorrectButton({
  onPress,
}: GameTurnPlayingCorrectButtonProps) {
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
        <View style={styles.playingCorrectDecorWrap}>
          <View style={[styles.playingCorrectRay, styles.playingCorrectRayA]} />
          <View style={[styles.playingCorrectRay, styles.playingCorrectRayB]} />
          <View style={[styles.playingCorrectRay, styles.playingCorrectRayC]} />
        </View>
        <View style={styles.playingCorrectCircle}>
          <Icon source="check" size={48} color={colors.textLight} />
        </View>
      </View>
    </Pressable>
  );
}
