import { StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../../../theme/theme";

export const newGameDeckCardStyles = StyleSheet.create({
  pressable: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.lg,
    color: colors.titleNavy,
  },
  subtitle: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  chevronWrap: {
    marginRight: -4,
  },
});
