import { StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../../theme/theme";

export const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 0,
  },
  screen: {
    flex: 1,
    position: "relative",
  },
  blueBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
  },
  patternDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: "#2b6fbe",
    opacity: 0.65,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.textLight,
    textTransform: "uppercase",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  logoSection: {
    alignItems: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 72,
    lineHeight: 66,
    color: colors.textLight,
    fontFamily: typography.families.display,
    textAlign: "center",
    letterSpacing: 1,
    transform: [{ skewX: "-8deg" }],
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 66,
    lineHeight: 58,
    color: colors.textLight,
    fontFamily: typography.families.body,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButtonItem: {
    flex: 1,
  },
  emptyCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background,
    alignItems: "center",
    gap: spacing.md,
  },
  emptyIconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xxxl,
    color: colors.text,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: typography.sizes.md,
    color: colors.text,
    textAlign: "center",
  },
  createButton: {
    width: "100%",
    borderRadius: borderRadius.xl,
  },
});
