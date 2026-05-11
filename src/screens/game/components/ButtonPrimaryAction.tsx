import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { borderRadius, colors } from "../../../theme/theme";

interface ButtonPrimaryActionProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "success";
  style?: ViewStyle;
}

const ButtonPrimaryAction: React.FC<ButtonPrimaryActionProps> = ({
  title,
  onPress,
  disabled = false,
  icon,
  size = "medium",
  variant = "primary",
  style,
}) => {
  const getSizeStyle = () => {
    if (size === "small") {
      return styles.smallButtonShell;
    }
    if (size === "large") {
      return styles.largeButtonShell;
    }
    return styles.mediumButtonShell;
  };

  return (
    <View style={[styles.button, getSizeStyle(), style]}>
      <Button
        mode="contained"
        onPress={onPress}
        disabled={disabled}
        icon={icon}
        buttonColor={variant === "success" ? colors.accent : undefined}
        style={styles.innerButton}
      >
        {title}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 15,
    width: "100%",
    borderRadius: borderRadius.xl,
  },
  innerButton: {
    borderRadius: borderRadius.xl,
  },
  smallButtonShell: {
    minHeight: 42,
  },
  mediumButtonShell: {
    minHeight: 50,
  },
  largeButtonShell: {
    minHeight: 60,
  },
});

export default ButtonPrimaryAction; 