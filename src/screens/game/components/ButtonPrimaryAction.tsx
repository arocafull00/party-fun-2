import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../../../theme/theme";

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
    
    if (variant === "success") {
      baseStyles.push(styles.successButton);
    } else {
      baseStyles.push(styles.primaryButton);
    }
    
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

  const getLabelStyle = () => {
    if (size === "large") {
      return styles.largeButtonLabel;
    }
    return styles.defaultButtonLabel;
  };

  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      style={getButtonStyle()}
      contentStyle={getContentStyle()}
      labelStyle={getLabelStyle()}
      icon={icon}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 15,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  successButton: {
    backgroundColor: colors.success,
  },
  smallButtonContent: {
    height: 40,
  },
  mediumButtonContent: {
    height: 50,
  },
  largeButtonContent: {
    height: 60,
  },
  defaultButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
  },
  largeButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
  },
});

export default ButtonPrimaryAction; 