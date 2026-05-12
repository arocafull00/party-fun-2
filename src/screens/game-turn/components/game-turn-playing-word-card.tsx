import React from "react";
import { ImageBackground } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

const cardBgImage = require("../../../../assets/card-bg.png");

type GameTurnPlayingWordCardProps = {
  cardText: string;
};

export function GameTurnPlayingWordCard({
  cardText,
}: GameTurnPlayingWordCardProps) {
  return (
    <ImageBackground
      source={cardBgImage}
      style={styles.playingWordCard}
      resizeMode="cover"
    >
      <Text style={styles.playingWordLabel}>PALABRA</Text>
      <Text
        style={styles.playingWordText}
        textBreakStrategy="simple"
      >
        {cardText}
      </Text>
    </ImageBackground>
  );
}
