import { Platform, StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../theme/theme";

export const deckListCardStyles = StyleSheet.create({
  pressable: {
    borderRadius: borderRadius.xl,
    backgroundColor: "#fdf4e8",
    borderWidth: 1,
    borderColor: "rgba(58, 40, 28, 0.1)",
    minHeight: 112,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: "#251810",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  pressablePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: "#2f2118",
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
    justifyContent: "center",
  },
  deckName: {
    fontFamily: typography.families.heading,
    color: "#2a1e12",
    fontSize: typography.sizes.xl,
    lineHeight: typography.sizes.xl + 6,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(47, 33, 24, 0.08)",
  },
  metaText: {
    fontFamily: typography.families.bodyBold,
    color: "#4a392d",
    fontSize: typography.sizes.sm,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  chevronWrap: {
    opacity: 0.55,
    marginLeft: spacing.xs,
  },
});
