import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BouncyButton } from "../../../shared/components/BouncyButton";
import { borderRadius } from "../../../theme/theme";

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
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.button];
    if (style) {
      baseStyles.push(style);
    }
    return baseStyles;
  };

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
    <View style={[getButtonStyle(), getSizeStyle()]}>
      <BouncyButton
        label={title}
        onPress={onPress}
        disabled={disabled}
        variant={variant === "success" ? "tertiary" : "primary"}
        icon={icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 15,
    width: "100%",
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