import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { colors, spacing, typography } from "../../../theme/theme";

interface RoundSummaryRowProps {
  roundNumber: number;
  blueCorrect: number;
  redCorrect: number;
}

export const RoundSummaryRow: React.FC<RoundSummaryRowProps> = ({
  roundNumber,
  blueCorrect,
  redCorrect,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.roundCell}>
        <Text style={styles.roundNumber}>{roundNumber}</Text>
      </View>

      <Text style={[styles.scoreCell, { color: colors.primary }]}>{blueCorrect}</Text>
      <Text style={[styles.scoreCell, { color: colors.redTeam }]}>{redCorrect}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: spacing.xl + spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary + "44",
  },
  roundCell: {
    width: spacing.xxl + spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  roundNumber: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
  },
  scoreCell: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.sizes.lg,
    fontFamily: typography.families.heading,
  },
});
