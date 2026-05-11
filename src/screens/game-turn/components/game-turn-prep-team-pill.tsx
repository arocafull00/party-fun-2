import React from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepTeamPillProps = {
  teamKey: "azul" | "rojo";
};

export function GameTurnPrepTeamPill({ teamKey }: GameTurnPrepTeamPillProps) {
  const isAzul = teamKey === "azul";
  const label = isAzul ? "EQUIPO AZUL" : "EQUIPO ROJO";

  return (
    <View
      style={[
        styles.prepTeamPill,
        isAzul ? styles.prepTeamPillAzul : styles.prepTeamPillRojo,
      ]}
    >
      <Icon source="account-group" size={22} color={'#ffffff'} />
      <Text style={styles.prepTeamPillText}>{label}</Text>
    </View>
  );
}
