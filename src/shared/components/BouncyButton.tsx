import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, colors, typography } from '../../theme/theme';

interface BouncyButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'tonal';
}

export const BouncyButton: React.FC<BouncyButtonProps> = ({
  label,
  onPress,
  icon,
  iconSize = 22,
  iconColor,
  disabled = false,
  variant = 'primary',
}) => {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const animatedStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: pressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
        },
      ],
    }),
    [pressAnim]
  );

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isLightTone = isPrimary || variant === 'surface' || variant === 'tonal';
  const resolvedIconColor = iconColor ?? (isPrimary ? colors.buttonPrimaryText : isSecondary ? colors.textLight : isLightTone ? colors.primary : colors.textLight);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.topLayer,
          variant === 'primary' && styles.topLayerPrimary,
          variant === 'secondary' && styles.topLayerSecondary,
          variant === 'tertiary' && styles.topLayerTertiary,
          variant === 'surface' && styles.topLayerSurface,
          variant === 'tonal' && styles.topLayerTonal,
          animatedStyle,
        ]}
      >
        {icon ? <Icon source={icon} size={iconSize} color={resolvedIconColor} /> : null}
        <Text style={[styles.label, isPrimary && styles.labelPrimary, !isPrimary && !isSecondary && isLightTone && styles.labelDark]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  disabledShell: {
    opacity: 0.5,
  },
  pressable: {
    width: '100%',
  },
  topLayer: {
    minHeight: 56,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  topLayerPrimary: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  topLayerSecondary: {
    backgroundColor: colors.primaryLight,
  },
  label: {
    color: colors.textLight,
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelDark: {
    color: colors.primary,
  },
  labelPrimary: {
    color: colors.text,
  },
});
