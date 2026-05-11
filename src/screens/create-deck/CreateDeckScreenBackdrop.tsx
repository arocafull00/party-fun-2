import React from "react";
import { StyleSheet, View } from "react-native";

const BG = "#FFFBF5";
const BLUE = "#B8D4F5";
const YELLOW = "#FFE08A";

export const CreateDeckScreenBackdrop: React.FC = () => {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.base} />
      <View style={[styles.dot, { top: "6%", left: "10%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "8%", left: "82%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "14%", left: "44%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "18%", left: "22%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "22%", left: "68%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "28%", left: "8%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "34%", left: "90%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "40%", left: "52%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "48%", left: "18%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "52%", left: "76%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "60%", left: "38%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "66%", left: "12%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "72%", left: "62%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "78%", left: "88%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "84%", left: "28%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "92%", left: "48%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "3%", left: "56%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "11%", left: "70%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "16%", left: "6%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "25%", left: "46%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "31%", left: "24%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "37%", left: "74%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "44%", left: "92%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "56%", left: "4%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "58%", left: "54%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "63%", left: "88%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "70%", left: "32%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "74%", left: "98%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "81%", left: "58%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "88%", left: "14%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "95%", left: "74%", backgroundColor: BLUE }]} />
      <View style={[styles.dot, { top: "42%", left: "34%", backgroundColor: YELLOW }]} />
      <View style={[styles.dotSm, { top: "50%", left: "96%", backgroundColor: BLUE }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.75,
  },
  dotSm: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.65,
  },
});
