import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { colors, spacing, typography } from "../../../theme/theme";

interface TeamMemberRowProps {
  name: string;
  color: string;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({ name, color }) => {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm / 2,
  },
  name: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
  },
});
