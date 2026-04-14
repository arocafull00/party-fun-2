import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, colors, typography } from '../../theme/theme';

interface BouncyButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  tone?: 'primary' | 'secondary' | 'tertiary';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const BouncyButton: React.FC<BouncyButtonProps> = ({
  label,
  onPress,
  icon,
  disabled = false,
  tone = 'primary',
  style,
  contentStyle,
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

  return (
    <View style={[styles.shell, style, disabled && styles.disabledShell]}>
      <View
        style={[
          styles.bottomEdge,
          tone === 'secondary' && styles.bottomEdgeSecondary,
          tone === 'tertiary' && styles.bottomEdgeTertiary,
        ]}
      />
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
            tone === 'secondary' && styles.topLayerSecondary,
            tone === 'tertiary' && styles.topLayerTertiary,
            animatedStyle,
            contentStyle,
          ]}
        >
          {icon ? <Icon source={icon} size={22} color={colors.textLight} /> : null}
          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  disabledShell: {
    opacity: 0.5,
  },
  bottomEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: colors.primaryDim,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  bottomEdgeSecondary: {
    backgroundColor: '#7f1402',
  },
  bottomEdgeTertiary: {
    backgroundColor: '#2c4700',
  },
  pressable: {
    width: '100%',
  },
  topLayer: {
    minHeight: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  topLayerSecondary: {
    backgroundColor: colors.secondary,
  },
  topLayerTertiary: {
    backgroundColor: colors.tertiary,
  },
  label: {
    color: colors.textLight,
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
