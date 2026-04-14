import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
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

  const getContentStyle = () => {
    if (size === "small") {
      return styles.smallButtonContent;
    } else if (size === "large") {
      return styles.largeButtonContent;
    }
    return styles.mediumButtonContent;
  };

  return (
    <BouncyButton
      label={title}
      onPress={onPress}
      disabled={disabled}
      tone={variant === "success" ? "tertiary" : "primary"}
      style={getButtonStyle()}
      contentStyle={getContentStyle()}
      icon={icon}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 15,
    width: "100%",
    borderRadius: borderRadius.xl,
  },
  smallButtonContent: {
    minHeight: 42,
  },
  mediumButtonContent: {
    minHeight: 50,
  },
  largeButtonContent: {
    minHeight: 60,
  },
});

export default ButtonPrimaryAction; 