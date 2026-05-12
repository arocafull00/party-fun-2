import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

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
        styles.playingCorrectButton,
        pressed && styles.playingRoundActionPressed,
      ]}
    >
      <View style={styles.playingButtonContent}>
        <View style={styles.playingButtonIconCircle}>
          <Icon source="check" size={32} color="#ffffff" />
        </View>
        <Text style={styles.playingButtonMainText}>¡SÍ!</Text>
        <Text style={styles.playingButtonSubText}>HE ACERTADO</Text>
      </View>
    </Pressable>
  );
}
