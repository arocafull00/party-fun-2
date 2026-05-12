import { Platform, StyleSheet } from "react-native";

import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../theme/theme";

export const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
    zIndex: 2,
  },
  elevatedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 0,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  elevatedCardGame: {
    backgroundColor: "transparent",
  },
  titleGame: {
    color: "#ffffff",
  },
  subtitleGame: {
    color: "rgba(255,255,255,0.88)",
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
    position: "relative",
  },
  side: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  sideEnd: {
    justifyContent: "flex-end",
  },
  titleLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none",
  },
  title: {
    fontFamily: typography.families.heading,
    fontSize: typography.sizes.lg,
    letterSpacing: 0.2,
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 0,
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.xs,
    letterSpacing: 0.8,
    color: colors.text,
    textAlign: "center",
  },
});

export const iconSlotStyles = StyleSheet.create({
  hit: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.background,
  },
});
