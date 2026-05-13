import React from "react";
import { Pressable, View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepStatCardProps = {
  label: string;
  value: string;
  icon: string;
  variant: "round" | "remaining";
  subtitle?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function GameTurnPrepStatCard({
  label,
  value,
  icon,
  variant,
  subtitle,
  onPress,
  accessibilityLabel,
}: GameTurnPrepStatCardProps) {
  const isRound = variant === "round";

  const inner = (
    <>
      <View
        style={[
          styles.prepStatIconCircle,
          isRound ? styles.prepStatIconBlue : styles.prepStatIconPurple,
        ]}
      >
        <Icon source={icon} size={24} color={"#ffffff"} />
      </View>
      <View
        style={[
          styles.prepStatCard,
          isRound ? styles.prepStatCardBlue : styles.prepStatCardPurple,
        ]}
      >
        <Text style={styles.prepStatLabel}>{label}</Text>
        <View style={styles.prepStatValueRow}>
          <Text style={styles.prepStatValue}>{value}</Text>
        </View>
        {subtitle ? (
          <Text style={styles.prepStatSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={styles.prepStatWrap}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={styles.prepStatWrap}>{inner}</View>;
}
