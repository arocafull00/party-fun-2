import { StyleSheet } from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    paddingTop: spacing.md,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.families.heading,
    fontSize: typography.sizes.xxxl,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    color: colors.text,
    opacity: 0.7,
    textAlign: "center",
  },
  roundSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  roundTitle: {
    fontFamily: typography.families.heading,
    fontSize: typography.sizes.display,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  roundBadge: {
  },
  roundBadgeText: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  bottomSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  nextButton: {
    borderRadius: borderRadius.xl,
    width: "100%",
    backgroundColor: colors.primary,
  },
  nextButtonContent: {
    minHeight: 56,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  nextButtonLabel: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.lg,
    letterSpacing: 0.15,
    color: "#FFFFFF",
  },
  nextButtonSubtitle: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.sm,
    color: colors.text,
    opacity: 0.6,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  noCardsText: {
    fontFamily: typography.families.body,
    fontSize: typography.sizes.md,
    color: colors.text,
    textAlign: "center",
    opacity: 0.7,
  },
});
