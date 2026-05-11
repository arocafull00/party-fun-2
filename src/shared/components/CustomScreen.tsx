import React from "react";
import { View, ViewStyle } from "react-native";
import { spacing } from "../../theme/theme";

interface CustomScreenProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  hideBackground?: boolean;
  header?: React.ReactNode | null;
}

export function CustomScreen({
  children,
  contentStyle,
  containerStyle,
  header,
}: CustomScreenProps) {
  return (
    <View style={[{ flex: 1 }, containerStyle]}>
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
        {header && header}
        {children}
      </View>
    </View>
  );
}
