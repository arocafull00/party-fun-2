import { StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../../../theme/theme";

export const teamCardStyles = StyleSheet.create({
  teamCardOuter: {
    width: "100%",
    flexDirection: "row",
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  leftBar: {
    width: 8,
    alignSelf: "stretch",
  },
  teamMain: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconBadgeWrap: {
    alignItems: "center",
    gap: spacing.sm,
  },
  teamIconCircle: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  },
  titleCol: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: 2,
  },
  teamTitle: {
    fontSize: typography.sizes.xxl,
    lineHeight: typography.sizes.xxl + 4,
    fontFamily: typography.families.heading,
    letterSpacing: 0.2,
  },
  countBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  countBadgeText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xs,
  },
  menuAnchor: {
    margin: 0,
    marginTop: -4,
  },
  playersList: {
    gap: spacing.sm,
  },
  addPlayerPressable: {
    minHeight: 56,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  addPlayerText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
  },
  menuSpacer: {
    width: 48,
    height: 44,
  },
});
