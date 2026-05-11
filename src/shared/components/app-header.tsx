import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../../theme/theme";

import { AppHeaderIconPlaceholder } from "./app-header-icon-button";
import { styles } from "./app-header.styles";

const DEFAULT_TITLE = "Party Fun 2";

interface AppHeaderProps {
  title?: string;
  subtitle?: string | null;
  left?: React.ReactNode | null;
  right?: React.ReactNode | null;
  transparent?: boolean;
}

export function AppHeader({
  title = DEFAULT_TITLE,
  subtitle,
  left,
  right,
  transparent,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const leftNode =
    left === undefined ? (
      <AppHeaderIconPlaceholder />
    ) : left === null ? null : (
      left
    );
  const rightNode =
    right === undefined ? (
      <AppHeaderIconPlaceholder />
    ) : right === null ? null : (
      right
    );

  return (
    <View style={[styles.outer, { paddingTop: Math.max(insets.top, spacing.sm) }]}>
      <View style={[styles.elevatedCard, transparent && styles.elevatedCardTransparent]}>
        <View style={styles.barRow}>
          <View style={styles.side}>{leftNode}</View>
          <View style={styles.titleLayer} pointerEvents="none">
            <Text style={styles.title} numberOfLines={subtitle ? 1 : 2}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View style={[styles.side, styles.sideEnd]}>{rightNode}</View>
        </View>
      </View>
    </View>
  );
}
