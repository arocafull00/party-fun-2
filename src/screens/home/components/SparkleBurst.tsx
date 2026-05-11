import React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../../theme/theme";

interface SparkleBurstProps {
  mirror?: boolean;
  streakColor?: string;
}

export const SparkleBurst: React.FC<SparkleBurstProps> = ({
  mirror,
  streakColor,
}) => {
  const c = streakColor ?? colors.accent;
  return (
    <View
      style={[
        styles.wrap,
        mirror ? styles.mirror : null,
      ]}
    >
      <View style={[styles.streak, styles.s1, { backgroundColor: c }]} />
      <View style={[styles.streak, styles.s2, { backgroundColor: c }]} />
      <View style={[styles.streak, styles.s3, { backgroundColor: c }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  streak: {
    width: 3,
    borderRadius: 2,
  },
  s1: {
    height: 10,
    transform: [{ rotate: "-35deg" }],
  },
  s2: {
    height: 14,
    transform: [{ rotate: "0deg" }],
  },
  s3: {
    height: 10,
    transform: [{ rotate: "35deg" }],
  },
});
