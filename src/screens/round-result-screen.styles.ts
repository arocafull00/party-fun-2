import { StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: "100%",
    alignItems: "center",
    gap: spacing.lg,
  },
  titleImage: {
    width: "92%",
    maxWidth: 420,
    height: 220,
    alignSelf: "center",
  },
  scoresSection: {
    width: "100%",
  },
  scoreCardsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  vsBadge: {
    width: spacing.xxl + spacing.sm,
    height: spacing.xxl + spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -spacing.md,
    zIndex: 1,
  },
  vsText: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
  },
  finalMessageContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  finalMessage: {
    fontSize: typography.sizes.xxxl,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
    textAlign: "center",
  },
  finalSubmessage: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.body,
    color: colors.text,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: "auto",
  },
  continueButton: {
    borderRadius: borderRadius.xl,
  },
  continueButtonContent: {
    minHeight: spacing.xxl + spacing.xs,
  },
  continueButtonLabel: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.bodyBold,
  },
});
