import React from "react";
import { View, ViewStyle } from "react-native";
import Background from "./background";
import { spacing } from "../../theme/theme";

interface CustomScreenProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

export function CustomScreen({
  children,
  contentStyle,
  containerStyle,
}: CustomScreenProps) {
  return (
    <View style={[{ flex: 1 }, containerStyle]}>
      <Background />
      <View
        style={[
          {
            flex: 1,
            width: "100%",
            paddingHorizontal: spacing.md,
            backgroundColor: "transparent",
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
