import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

import { borderRadius, colors, spacing, typography } from "../../../theme/theme";

interface RoundScoreCardProps {
  teamName: string;
  score: number;
  color: string;
  side: "left" | "right";
}

export const RoundScoreCard: React.FC<RoundScoreCardProps> = ({
  teamName,
  score,
  color,
  side,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: color + "66",
          backgroundColor: color + "12",
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            borderColor: color + "4D",
            backgroundColor: colors.background,
          },
        ]}
      >
        <MaterialCommunityIcons name="account-group" size={32} color={color} />
      </View>
      <Text style={[styles.teamName, { color }]}>{teamName}</Text>
      <Text style={[styles.score, { color }]}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  iconCircle: {
    width: spacing.xxxl + spacing.md,
    height: spacing.xxxl + spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -spacing.xxl,
    marginBottom: spacing.sm,
  },
  teamName: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.bodyBold,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  score: {
    fontSize: typography.sizes.display + typography.sizes.xs,
    lineHeight: typography.sizes.display + spacing.xl,
    fontFamily: typography.families.heading,
    textAlign: "center",
  },
});
