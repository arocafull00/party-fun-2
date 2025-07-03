import React from "react";
import { View, ViewStyle } from "react-native";
import Background from "./background";

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

      <View
        style={[
          {
            flex: 1,
            width: "100%",
            paddingHorizontal: 16,
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
