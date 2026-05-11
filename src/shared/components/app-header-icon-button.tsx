import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "react-native-paper";

import { colors } from "../../theme/theme";

import { iconSlotStyles as styles } from "./app-header.styles";

type IconSource = React.ComponentProps<typeof Icon>["source"];

interface AppHeaderIconButtonProps {
  icon: IconSource;
  onPress?: () => void;
  showBadge?: boolean;
  iconColor?: string;
}

export function AppHeaderIconButton({
  icon,
  onPress,
  showBadge,
  iconColor = colors.onSurface,
}: AppHeaderIconButtonProps) {
  const content = (
    <>
      <Icon source={icon} size={20} color={iconColor} />
      {showBadge ? <View style={styles.badge} /> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.hit}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={onPress}
      style={({ pressed }) => [styles.hit, pressed && { opacity: 0.88 }]}
    >
      {content}
    </Pressable>
  );
}

export function AppHeaderIconPlaceholder() {
  return <View style={styles.hit} accessibilityElementsHidden />;
}
