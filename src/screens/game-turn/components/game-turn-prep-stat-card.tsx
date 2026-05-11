import React from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { SparkleBurst } from "../../home/components/SparkleBurst";
import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepStatCardProps = {
  label: string;
  value: string;
  icon: string;
  variant: "round" | "remaining";
};

export function GameTurnPrepStatCard({
  label,
  value,
  icon,
  variant,
}: GameTurnPrepStatCardProps) {
  const isRound = variant === "round";

  return (
    <View style={styles.prepStatWrap}>
      <View
        style={[
          styles.prepStatIconCircle,
          isRound ? styles.prepStatIconBlue : styles.prepStatIconPurple,
        ]}
      >
        <Icon source={icon} size={24} color={colors.textLight} />
      </View>
      <View
        style={[
          styles.prepStatCard,
          isRound ? styles.prepStatCardBlue : styles.prepStatCardPurple,
        ]}
      >
        <Text style={styles.prepStatLabel}>{label}</Text>
        <View style={styles.prepStatValueRow}>
          <SparkleBurst streakColor={isRound ? colors.teamAzulTint : colors.accuracyTint} />
          <Text style={styles.prepStatValue}>{value}</Text>
          <SparkleBurst mirror streakColor={isRound ? colors.teamAzulTint : colors.accuracyTint} />
        </View>
      </View>
    </View>
  );
}
