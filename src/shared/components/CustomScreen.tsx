import React from "react";
import { View, ViewStyle, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/theme";
import Background from "./background";

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
    <View style={{ flex: 1}}>
      {/* Background that covers the entire screen */}
      <Background />
      
      {/* Safe area content */}
      <SafeAreaView
        style={[
          containerStyle,
          {
            flex: 1,
            width: "100%",
            height: "100%",
            position: "relative",
            backgroundColor: "transparent",
          },
        ]}
      >
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
      </SafeAreaView>
    </View>
  );
}
