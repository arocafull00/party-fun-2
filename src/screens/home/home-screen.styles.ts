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
    color: '#ffffff',
    textTransform: "uppercase",
  },
  homeCenteredBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.lg,
  },
  mainScrollCentered: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  mainActionsColumn: {
    width: "100%",
    maxWidth: 440,
    gap: spacing.lg,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: "100%",
  },
  titleImage: {
    width: "96%",
    maxWidth: 440,
    height: 300,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButtonItem: {
    flex: 1,
  },
  emptyCard: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
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

export const homeScreenColors = {
  ctaBlue: "#0066E1",
  navActiveBg: "#C8E3FF",
  navInactiveIcon: "#8A95A8",
  navInactiveLabel: "#8A95A8",
} as const;
