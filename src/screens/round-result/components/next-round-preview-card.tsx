import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

import { borderRadius, colors, spacing, typography } from "../../../theme/theme";

interface NextRoundPreviewCardProps {
  phaseName: string;
  phaseIcon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}

export const NextRoundPreviewCard: React.FC<NextRoundPreviewCardProps> = ({
  phaseName,
  phaseIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.prepareBanner}>
        <Text style={styles.prepareText}>¡PREPÁRATE PARA LA</Text>
        <Text style={styles.prepareText}>SIGUIENTE RONDA!</Text>
      </View>

      <View style={styles.nextRoundCard}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={phaseIcon} size={42} color={colors.accent} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.label}>Siguiente ronda:</Text>
          <Text style={styles.phaseName}>¡{phaseName.toUpperCase()}!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm,
  },
  prepareBanner: {
    width: "100%",
    padding: spacing.md,
  },
  prepareText: {
    fontSize: typography.sizes.xl,
    lineHeight: typography.sizes.xl + spacing.xs,
    fontFamily: typography.families.heading,
    color: colors.accent,
    textTransform: "uppercase",
    textAlign: "center",
  },
  nextRoundCard: {
    width: "100%",
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconCircle: {
    width: spacing.xxxl + spacing.lg,
    height: spacing.xxxl + spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent + "22",
  },
  textWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
  },
  phaseName: {
    fontSize: typography.sizes.display,
    lineHeight: typography.sizes.display + spacing.sm,
    fontFamily: typography.families.heading,
    color: colors.accent,
  },
});
