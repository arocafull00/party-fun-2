import React from "react";
import { ImageBackground, View } from "react-native";

import { styles } from "../../game-turn-screen.styles";

const gameBgImage = require("../../../../assets/game-bg.png");

type GameTurnPlayingBackgroundProps = {
  children: React.ReactNode;
};

export function GameTurnPlayingBackground({
  children,
}: GameTurnPlayingBackgroundProps) {
  return (
    <ImageBackground
      source={gameBgImage}
      style={styles.playingBgRoot}
      resizeMode="cover"
    >
      <View style={styles.playingBgContent}>{children}</View>
    </ImageBackground>
  );
}
