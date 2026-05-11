import { StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../../../theme/theme";

export const newGameContinueButtonStyles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  row: {
    minHeight: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.textLight,
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.lg,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
