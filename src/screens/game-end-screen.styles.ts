import { StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  headerSection: {
    alignItems: "center",
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontFamily: typography.families.heading,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
    textAlign: "center",
  },
  teamCardsRow: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
  },
  roundsCard: {
    width: "100%",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.secondary + "55",
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  roundsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary + "22",
  },
  roundsHeaderRound: {
    width: spacing.xxl + spacing.sm,
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
  },
  roundsHeaderTeam: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
  },
  roundsBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  emptyRoundsText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.body,
    color: colors.text,
    textAlign: "center",
    paddingVertical: spacing.sm,
  },
  actionsContainer: {
    width: "100%",
    gap: spacing.sm,
  },
  primaryButton: {
    borderRadius: borderRadius.xl,
  },
  secondaryButton: {
    borderRadius: borderRadius.xl,
  },
  buttonContent: {
    minHeight: spacing.xxl,
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.bodyBold,
  },
  saveStatus: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.bodyBold,
    color: colors.primary,
    textAlign: "center",
  },
});
