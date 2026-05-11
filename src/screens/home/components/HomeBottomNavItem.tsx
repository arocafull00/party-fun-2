import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";

import { homeScreenColors } from "../home-screen.styles";
import { typography } from "../../../theme/theme";

export interface HomeBottomNavItemProps {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
}

export const HomeBottomNavItem: React.FC<HomeBottomNavItemProps> = ({
  label,
  icon,
  active,
  onPress,
}) => {
  if (!active) {
    return (
      <Pressable
        style={styles.item}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: false }}
      >
        <View style={styles.iconInactive}>
          <Icon source={icon} size={24} color={homeScreenColors.navInactiveIcon} />
        </View>
        <Text style={styles.labelInactive}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: true }}
    >
      <View style={styles.iconActive}>
        <Icon source={icon} size={24} color={homeScreenColors.ctaBlue} />
      </View>
      <Text style={styles.labelActive}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  iconActive: {
    width: 48,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: homeScreenColors.navActiveBg,
  },
  iconInactive: {
    width: 48,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  labelActive: {
    fontFamily: typography.families.bodyBold,
    fontSize: 11,
    color: homeScreenColors.ctaBlue,
    letterSpacing: 0.2,
  },
  labelInactive: {
    fontFamily: typography.families.body,
    fontSize: 11,
    color: homeScreenColors.navInactiveLabel,
    letterSpacing: 0.2,
  },
});
