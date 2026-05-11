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
      {header === null ? null : header ?? null}
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
