import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

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
        styles.playingIncorrectButton,
        pressed && styles.playingRoundActionPressed,
      ]}
    >
      <View style={styles.playingButtonContent}>
        <View style={styles.playingButtonIconCircle}>
          <Icon source="close" size={32} color="#ffffff" />
        </View>
        <Text style={styles.playingButtonMainText}>NO</Text>
        <Text style={styles.playingButtonSubText}>HE FALLADO</Text>
      </View>
    </Pressable>
  );
}
