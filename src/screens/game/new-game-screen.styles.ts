import { StyleSheet } from "react-native";

import { borderRadius, colors, spacing, typography } from "../../theme/theme";

export const newGameScreenStyles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 0,
    backgroundColor: '#ffffff',
  },
  screenBody: {
    flex: 1,
  },
  headerTitleBlock: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  mainTitle: {
    fontFamily: typography.families.heading,
    color: colors.text,
    fontSize: typography.sizes.xxxl,
    lineHeight: typography.sizes.xxxl + 4,
  },
  mainSubtitle: {
    fontFamily: typography.families.body,
    color: colors.text,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },
  startButton: {
    marginTop: spacing.xs,
  },
  modalOverlayRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    elevation: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalKeyboardAvoid: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: spacing.lg,
    pointerEvents: "box-none",
  },
  modalPlayerScroll: {
    width: "100%",
    maxHeight: "86%",
  },
  modalScrollInner: {
    paddingVertical: spacing.lg,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.families.heading,
    marginBottom: 8,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  textInput: {
    width: "100%",
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  modalButton: {
    minWidth: 100,
  },
});
