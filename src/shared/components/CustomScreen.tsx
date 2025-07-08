import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import Background from "./background";
import GlassCard from "./GlassCard";

interface CustomScreenProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

export function CustomScreen({
  children,
  contentStyle,
}: CustomScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      {/* Background that covers the entire screen */}
      <Background />

      <GlassCard style={[styles.glassContainer, contentStyle]}>{children}</GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
});
