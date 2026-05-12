import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepStartButtonProps = {
  onPress: () => void;
};

export function GameTurnPrepStartButton({ onPress }: GameTurnPrepStartButtonProps) {
  return (
    <View style={styles.prepStartShell}>
      <Button
        mode="elevated"
        onPress={onPress}
        icon="play"
        buttonColor={colors.primary}
        textColor="#FFFFFF"
        style={styles.prepStartButton}
        contentStyle={styles.prepStartButtonContent}
        labelStyle={styles.prepStartButtonLabel}
      >
        ¡Empezar!
      </Button>
    </View>
  );
}
